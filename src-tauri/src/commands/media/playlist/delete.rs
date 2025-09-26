use std::sync::Mutex;
use tauri::State;

use crate::{
    db::queries::delete_playlist,
    models::app_state::AppState,
};

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
