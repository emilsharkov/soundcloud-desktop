use std::sync::Mutex;
use tauri::State;
use uuid::Uuid;

use crate::{db::queries::{
    create_playlist, get_playlist, get_playlists, update_playlist, delete_playlist,
    add_song_to_playlist, remove_song_from_playlist, get_playlist_songs,
    reorder_playlist_tracks, reorder_playlists,
}, models::app_state::AppState};

#[tauri::command]
pub async fn create_playlist_command(
    state: State<'_, Mutex<AppState>>,
    name: String,
    position: i32,
) -> Result<String, String> {
    let pool = state.lock().unwrap().db_pool.clone();
    let id = Uuid::new_v4().to_string();
    
    create_playlist(&pool, &id, &name, position)
        .await
        .map_err(|e| format!("Failed to create playlist: {e}"))?;
    
    Ok(id)
}

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
pub async fn delete_playlist_command(
    state: State<'_, Mutex<AppState>>,
    id: String,
) -> Result<(), String> {
    let pool = state.lock().unwrap().db_pool.clone();
    
    delete_playlist(&pool, &id)
        .await
        .map_err(|e| format!("Failed to delete playlist: {e}"))
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
