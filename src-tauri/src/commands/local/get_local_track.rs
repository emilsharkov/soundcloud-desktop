use std::sync::Mutex;
use tauri::State;

use crate::{
    db::queries::{get_track, TrackRow},
    models::app_state::AppState,
};

#[tauri::command]
pub async fn get_local_track(
    state: State<'_, Mutex<AppState>>,
    id: String,
) -> Result<TrackRow, String> {
    let pool = state.lock().unwrap().db_pool.clone();
    let track = get_track(&pool, &id)
        .await
        .map_err(|e| format!("Failed to get track: {e}"))?;
    Ok(track.ok_or("Track not found")?)
}
