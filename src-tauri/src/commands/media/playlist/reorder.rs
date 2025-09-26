use std::sync::Mutex;
use tauri::State;

use crate::{
    db::queries::{reorder_playlist_tracks, reorder_playlists},
    models::app_state::AppState,
};

#[tauri::command]
pub async fn reorder_playlist_tracks_command(
    state: State<'_, Mutex<AppState>>,
    playlist_id: String,
    track_positions: Vec<(String, i32)>, // (track_id, new_position)
) -> Result<(), String> {
    let pool = state.lock().unwrap().db_pool.clone();

    reorder_playlist_tracks(&pool, &playlist_id, track_positions)
        .await
        .map_err(|e| format!("Failed to reorder playlist tracks: {e}"))
}

#[tauri::command]
pub async fn reorder_playlists_command(
    state: State<'_, Mutex<AppState>>,
    playlist_positions: Vec<(String, i32)>, // (playlist_id, new_position)
) -> Result<(), String> {
    let pool = state.lock().unwrap().db_pool.clone();

    reorder_playlists(&pool, playlist_positions)
        .await
        .map_err(|e| format!("Failed to reorder playlists: {e}"))
}
