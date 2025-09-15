use crate::models::app_state::AppState;
use soundcloud_rs::response::Playlist;
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
pub async fn download_playlist(
    state: State<'_, Mutex<AppState>>,
    playlist: Playlist,
) -> Result<(), String> {
    let soundcloud_client = state.lock().unwrap().soundcloud_client.clone();
    let app_data_dir = state.lock().unwrap().app_data_dir.clone();
    let music_dir = app_data_dir.join("music");
    soundcloud_client
        .download_playlist(
            &playlist,
            Some(music_dir.to_str().ok_or("Failed to get music dir")?),
            Some("/"),
        )
        .await
        .map_err(|e| format!("Failed to download playlist: {e}"))?;
    Ok(())
}
