use std::fs::remove_file;
use std::sync::Mutex;
use tauri::State;

use crate::{db::queries::delete_track, models::app_state::AppState};

#[tauri::command]
pub async fn delete_local_track(
    state: State<'_, Mutex<AppState>>,
    id: i64,
) -> Result<(), String> {
    let pool = state.lock().unwrap().db_pool.clone();
    let music_dir = state.lock().unwrap().app_data_dir.clone().join("music");
    let mp3_path = music_dir.join(id.to_string()).with_extension("mp3");

    remove_file(mp3_path).map_err(|e| format!("Failed to delete mp3: {e}"))?;
    delete_track(&pool, id)
        .await
        .map_err(|e| format!("Failed to delete track: {e}"))?;

    Ok(())
}
