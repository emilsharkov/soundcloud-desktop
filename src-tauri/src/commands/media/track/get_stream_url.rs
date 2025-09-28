use crate::models::app_state::AppState;
use soundcloud_rs::response::StreamType;
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
pub async fn get_stream_url(
    state: State<'_, Mutex<AppState>>,
    id: i64,
    stream_type: Option<StreamType>,
) -> Result<String, String> {
    let soundcloud_client = state.lock().unwrap().soundcloud_client.clone();
    let stream_url = soundcloud_client
        .get_stream_url(&id, stream_type.as_ref())
        .await
        .map_err(|e| format!("Failed to get stream url: {e}"))?;
    Ok(stream_url)
}
