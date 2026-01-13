use std::path::PathBuf;
use std::sync::Mutex;
use tauri::State;

use crate::{
    models::app_state::AppState,
    utils::export::export_tracks,
};

#[tauri::command]
pub async fn export_song(
    state: State<'_, Mutex<AppState>>,
    id: i64,
    folder_path: String,
) -> Result<(), String> {
    let music_dir = state.lock().unwrap().app_data_dir.clone().join("music");
    let source_path = music_dir.join(id.to_string()).with_extension("mp3");

    if !source_path.exists() {
        return Err(format!("Song file not found: {}", source_path.display()));
    }

    // Convert folder path string to PathBuf
    let folder_path_buf = PathBuf::from(folder_path);

    // Export the single track (no subfolder)
    export_tracks(
        &[id as u64],
        &music_dir,
        &folder_path_buf,
        None,
    )?;

    Ok(())
}
