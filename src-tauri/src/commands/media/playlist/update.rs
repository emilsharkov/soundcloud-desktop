use std::sync::Mutex;
use tauri::State;

use crate::{
    db::queries::{update_playlist, add_song_to_playlist, remove_song_from_playlist},
    models::app_state::AppState,
};

#[tauri::command]
pub async fn update_playlist_command(
    state: State<'_, Mutex<AppState>>,
    id: String,
    name: String,
    position: i32,
) -> Result<(), String> {
    let pool = state.lock().unwrap().db_pool.clone();

    update_playlist(&pool, &id, &name, position)
        .await
        .map_err(|e| format!("Failed to update playlist: {e}"))
}

#[tauri::command]
pub async fn add_song_to_playlist_command(
    state: State<'_, Mutex<AppState>>,
    playlist_id: String,
    track_id: String,
) -> Result<(), String> {
    let pool = state.lock().unwrap().db_pool.clone();

    add_song_to_playlist(&pool, &playlist_id, &track_id)
        .await
        .map_err(|e| format!("Failed to add song to playlist: {e}"))
}

#[tauri::command]
pub async fn remove_song_from_playlist_command(
    state: State<'_, Mutex<AppState>>,
    playlist_id: String,
    track_id: String,
) -> Result<(), String> {
    let pool = state.lock().unwrap().db_pool.clone();

    remove_song_from_playlist(&pool, &playlist_id, &track_id)
        .await
        .map_err(|e| format!("Failed to remove song from playlist: {e}"))
}
