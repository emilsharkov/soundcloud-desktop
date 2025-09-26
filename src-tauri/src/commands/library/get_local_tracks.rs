use std::sync::Mutex;
use tauri::State;

use crate::{
    db::queries::{get_tracks, TrackRow},
    models::app_state::AppState,
};

#[tauri::command]
pub async fn get_local_tracks(state: State<'_, Mutex<AppState>>) -> Result<Vec<TrackRow>, String> {
    let pool = state.lock().unwrap().db_pool.clone();
    let tracks = get_tracks(&pool, None, None)
        .await
        .map_err(|e| format!("Failed to get tracks: {e}"))?;
    Ok(tracks)
}
