use crate::models::app_state::AppState;
use soundcloud_rs::response::{StreamType, Track};
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
pub async fn download_track(
    state: State<'_, Mutex<AppState>>,
    track: Track,
    stream_type: Option<StreamType>,
    destination: Option<String>,
    filename: Option<String>,
) -> Result<(), String> {
    let soundcloud_client = state.lock().unwrap().soundcloud_client.clone();
    soundcloud_client
        .download_track(
            &track,
            stream_type.as_ref(),
            destination.as_deref(),
            filename.as_deref(),
        )
        .await
        .expect("Failed to download track");
    Ok(())
}
