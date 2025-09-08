use crate::models::app_state::AppState;
use soundcloud_rs::response::{StreamType, Track};
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
pub async fn get_stream_url(
    state: State<'_, Mutex<AppState>>,
    track: Track,
    stream_type: Option<StreamType>,
) -> Result<String, String> {
    let soundcloud_client = state.lock().unwrap().soundcloud_client.clone();
    println!("stream_type: {:?}", stream_type);
    let stream_url = soundcloud_client
        .get_stream_url(&track, stream_type.as_ref())
        .await
        .expect("Failed to get stream url");
    Ok(stream_url)
}
