use std::sync::Mutex;
use tauri::State;

use crate::{
    db::queries::reorder_tracks,
    models::app_state::AppState,
};

#[tauri::command]
pub async fn reorder_tracks_command(
    state: State<'_, Mutex<AppState>>,
    track_positions: Vec<(i64, i32)>, // (track_id, new_position)
) -> Result<(), String> {
    let pool = state.lock().unwrap().db_pool.clone();

    reorder_tracks(&pool, track_positions)
        .await
        .map_err(|e| format!("Failed to reorder tracks: {e}"))
}
