use crate::{
    commands::utils::{check_offline_mode, format_error_with_context, handle_error},
    models::app_state::AppState,
};
use soundcloud_rs::{response::StreamType, Identifier};
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
pub async fn get_stream_url(
    state: State<'_, Mutex<AppState>>,
    id: i64,
    stream_type: Option<StreamType>,
) -> Result<String, String> {
    check_offline_mode(&state)
        .map_err(|e| format_error_with_context("App is in offline mode", e))?;

    let soundcloud_client = state.lock().unwrap().soundcloud_client.clone();
    let client = soundcloud_client
        .as_ref()
        .as_ref()
        .ok_or("SoundCloud client is not available")?;
    let stream_url = client
        .get_stream_url(&Identifier::Id(id), stream_type.as_ref())
        .await
        .map_err(|e| {
            let app_error = handle_error(&state, &e);
            format_error_with_context("Failed to get stream url", app_error)
        })?;
    Ok(stream_url)
}
