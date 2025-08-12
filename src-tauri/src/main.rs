// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

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

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle().clone();
            let app_data_dir = app_handle
                .path()
                .app_data_dir()
                .expect("Failed to get app data dir");
            init_app_data_dir(&app_data_dir).expect("Failed to init app data dir");

            let app_state = tauri::async_runtime::block_on(async {
                let db_pool = setup_database(&app_data_dir)
                    .await
                    .expect("Failed to setup database");
                let soundcloud_client = soundcloud_rs::Client::new()
                    .await
                    .expect("Failed to create soundcloud client");
                AppState {
                    db_pool: Arc::new(db_pool),
                    soundcloud_client: Arc::new(soundcloud_client),
                }
            });
            app.manage(Mutex::new(app_state));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            search_results,
            search_tracks,
            get_stream_url,
            download_track
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
