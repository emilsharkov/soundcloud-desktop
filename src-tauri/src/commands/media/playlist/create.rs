use std::sync::Mutex;
use tauri::State;

use crate::{db::queries::create_playlist, models::app_state::AppState};

#[tauri::command]
pub async fn create_playlist_command(
    state: State<'_, Mutex<AppState>>,
    name: String,
    position: i32,
) -> Result<(), String> {
    let pool = state.lock().unwrap().db_pool.clone();

    create_playlist(&pool, &name, position)
        .await
        .map_err(|e| format!("Failed to create playlist: {e}"))?;

    Ok(())
}
