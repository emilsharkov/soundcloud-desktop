use std::sync::Mutex;
use tauri::State;

use crate::{
    db::queries::{get_playlist, get_playlist_songs, get_playlists},
    models::app_state::AppState,
};

#[tauri::command]
pub async fn get_playlists_command(
    state: State<'_, Mutex<AppState>>,
    limit: Option<i64>,
    offset: Option<i64>,
) -> Result<Vec<crate::db::queries::PlaylistRow>, String> {
    let pool = state.lock().unwrap().db_pool.clone();

    get_playlists(&pool, limit, offset)
        .await
        .map_err(|e| format!("Failed to get playlists: {e}"))
}

#[tauri::command]
pub async fn get_playlist_command(
    state: State<'_, Mutex<AppState>>,
    id: String,
) -> Result<Option<crate::db::queries::PlaylistRow>, String> {
    let pool = state.lock().unwrap().db_pool.clone();

    get_playlist(&pool, &id)
        .await
        .map_err(|e| format!("Failed to get playlist: {e}"))
}

#[tauri::command]
pub async fn get_playlist_songs_command(
    state: State<'_, Mutex<AppState>>,
    playlist_id: String,
) -> Result<Vec<crate::db::queries::PlaylistSongRow>, String> {
    let pool = state.lock().unwrap().db_pool.clone();

    get_playlist_songs(&pool, &playlist_id)
        .await
        .map_err(|e| format!("Failed to get playlist songs: {e}"))
}
