use std::fs::remove_file;
use std::sync::Mutex;
use tauri::State;

use crate::{db::queries::delete_track, models::app_state::AppState};

#[tauri::command]
pub async fn delete_local_track(
    state: State<'_, Mutex<AppState>>,
    id: String,
) -> Result<(), String> {
    let music_dir = state.lock().unwrap().app_data_dir.clone().join("music");
    let path = music_dir.join(&id).with_extension("mp3");
    remove_file(path).expect("Failed to delete file");

    let pool = state.lock().unwrap().db_pool.clone();
    delete_track(&pool, &id)
        .await
        .expect("Failed to delete track");
    Ok(())
}
