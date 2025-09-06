use crate::models::app_state::AppState;
use soundcloud_rs::response::Playlist;
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
pub async fn download_playlist(
    state: State<'_, Mutex<AppState>>,
    playlist: Playlist,
    destination: Option<String>,
    playlist_name: Option<String>,
) -> Result<(), String> {
    let soundcloud_client = state.lock().unwrap().soundcloud_client.clone();
    soundcloud_client
        .download_playlist(
            &playlist,
            destination.as_deref(),
            playlist_name.as_deref(),
        )
        .await
        .expect("Failed to download playlist");
    Ok(())
}
