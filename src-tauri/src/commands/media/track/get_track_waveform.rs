use crate::models::app_state::AppState;
use soundcloud_rs::response::{Track, Waveform};
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
pub async fn get_track_waveform(
    state: State<'_, Mutex<AppState>>,
    track_id: i64,
) -> Result<Waveform, String> {
    let soundcloud_client = state.lock().unwrap().soundcloud_client.clone();
    let waveform = soundcloud_client
        .get_track_waveform(&track_id)
        .await
        .map_err(|e| format!("Failed to get track waveform: {e}"))?;
    Ok(waveform)
}
