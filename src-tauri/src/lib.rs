mod commands;
mod db;
mod models;
mod utils;

use std::sync::{Arc, Mutex};

use commands::*;
use db::setup::setup_database;
use models::app_state::AppState;
use tauri::Manager;
use utils::init_app_data_dir::init_app_data_dir;
use utils::init_music_dir::init_music_dir;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle().clone();
            let app_data_dir = app_handle
                .path()
                .app_data_dir()
                .expect("Failed to get app data dir");

            init_app_data_dir(&app_data_dir).expect("Failed to init app data dir");
            init_music_dir(&app_data_dir).expect("Failed to init music dir");
            // init_song_images_dir(&app_data_dir).expect("Failed to init song images dir");
            println!("Music dir: {:?}", app_data_dir.join("music"));

            let app_state: AppState = tauri::async_runtime::block_on(async {
                let db_pool = setup_database(&app_data_dir)
                    .await
                    .expect("Failed to setup database");

                let soundcloud_client = soundcloud_rs::ClientBuilder::new()
                    .with_max_retries(1)
                    .with_retry_on_401(true)
                    .build()
                    .await
                    .ok();

                let is_offline = Arc::new(std::sync::atomic::AtomicBool::new(
                    soundcloud_client.is_none(),
                ));

                AppState {
                    db_pool: Arc::new(db_pool),
                    soundcloud_client: Arc::new(soundcloud_client),
                    app_data_dir: Arc::new(app_data_dir),
                    is_offline,
                }
            });
            app.manage(Mutex::new(app_state));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Search
            search_results,
            search_tracks,
            search_playlists,
            // Track
            get_stream_url,
            get_track_waveform,
            download_track,
            // Download
            download_playlist,
            download_track,
            // Local
            update_local_track,
            update_local_track_metadata,
            delete_local_track,
            get_local_track,
            get_local_tracks,
            get_song_image,
            // Playlist
            create_playlist_command,
            get_playlists_command,
            get_playlist_command,
            update_playlist_command,
            delete_playlist_command,
            add_song_to_playlist_command,
            remove_song_from_playlist_command,
            get_playlist_songs_command,
            // Offline
            get_offline_mode,
            set_offline_mode,
            test_connectivity,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
