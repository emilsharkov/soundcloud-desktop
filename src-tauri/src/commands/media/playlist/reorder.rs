use std::sync::Mutex;
use tauri::State;

use crate::{
    db::queries::{reorder_playlist_tracks, reorder_playlists},
    models::app_state::AppState,
};

#[tauri::command]
pub async fn reorder_playlist_tracks_command(
    state: State<'_, Mutex<AppState>>,
    id: i64,
    track_positions: Vec<(i64, i32)>, // (track_id, new_position)
) -> Result<(), String> {
    let pool = state.lock().unwrap().db_pool.clone();

    reorder_playlist_tracks(&pool, id, track_positions)
        .await
        .map_err(|e| format!("Failed to reorder playlist tracks: {e}"))
}

#[tauri::command]
pub async fn reorder_playlists_command(
    state: State<'_, Mutex<AppState>>,
    positions: Vec<(i64, i32)>, // (playlist_id, new_position)
) -> Result<(), String> {
    let pool = state.lock().unwrap().db_pool.clone();

    reorder_playlists(&pool, positions)
        .await
        .map_err(|e| format!("Failed to reorder playlists: {e}"))
}
