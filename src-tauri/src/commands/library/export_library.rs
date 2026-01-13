use std::path::PathBuf;
use std::sync::Mutex;
use tauri::State;

use crate::{
    db::queries::get_tracks,
    models::app_state::AppState,
    utils::export::export_tracks,
};

#[tauri::command]
pub async fn export_library(
    state: State<'_, Mutex<AppState>>,
    folder_path: String,
) -> Result<(), String> {
    let pool = state.lock().unwrap().db_pool.clone();
    let tracks = get_tracks(&pool, None, None)
        .await
        .map_err(|e| format!("Failed to get tracks: {e}"))?;

    if tracks.is_empty() {
        return Err("Library is empty".to_string());
    }

    let music_dir = state.lock().unwrap().app_data_dir.clone().join("music");

    // Convert folder path string to PathBuf
    let folder_path_buf = PathBuf::from(folder_path);
    
    // Extract track IDs from tracks
    let track_ids: Vec<u64> = tracks.iter().map(|track| track.id).collect();

    // Export tracks to a subfolder named "library"
    export_tracks(
        &track_ids,
        &music_dir,
        &folder_path_buf,
        Some("library"),
    )?;

    Ok(())
}
