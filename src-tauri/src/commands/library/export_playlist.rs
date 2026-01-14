use std::path::PathBuf;
use std::sync::Mutex;
use tauri::State;

use crate::{
    db::queries::{get_playlist, get_playlist_songs},
    models::app_state::AppState,
    utils::export::export_tracks,
};

#[tauri::command]
pub async fn export_playlist(
    state: State<'_, Mutex<AppState>>,
    playlist_id: i64,
    folder_path: String,
) -> Result<(), String> {
    let pool = state.lock().unwrap().db_pool.clone();

    // Get playlist to get the name
    let playlist = get_playlist(&pool, playlist_id)
        .await
        .map_err(|e| format!("Failed to get playlist: {e}"))?
        .ok_or("Playlist not found")?;

    let playlist_songs = get_playlist_songs(&pool, playlist_id)
        .await
        .map_err(|e| format!("Failed to get playlist songs: {e}"))?;

    if playlist_songs.is_empty() {
        return Err("Playlist is empty".to_string());
    }

    let music_dir = state.lock().unwrap().app_data_dir.clone().join("music");

    // Convert folder path string to PathBuf
    let folder_path_buf = PathBuf::from(folder_path);

    // Extract track IDs from playlist songs
    let track_ids: Vec<u64> = playlist_songs.iter().map(|song| song.track_id).collect();

    // Export tracks to a subfolder with the playlist name
    export_tracks(
        &track_ids,
        &music_dir,
        &folder_path_buf,
        Some(&playlist.name),
    )?;

    Ok(())
}
