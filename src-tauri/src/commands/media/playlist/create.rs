use std::sync::Mutex;
use tauri::State;
use uuid::Uuid;

use crate::{
    db::queries::create_playlist,
    models::app_state::AppState,
};

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
