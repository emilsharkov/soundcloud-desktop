use crate::{
    commands::utils::{format_error_with_context, handle_error},
    models::app_state::AppState,
};
use soundcloud_rs::Identifier;
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
pub async fn download_playlist(state: State<'_, Mutex<AppState>>, id: i64) -> Result<(), String> {
    let soundcloud_client = state.lock().unwrap().soundcloud_client.clone();
    let client = soundcloud_client
        .as_ref()
        .as_ref()
        .ok_or("SoundCloud client is not available")?;
    let app_data_dir = state.lock().unwrap().app_data_dir.clone();
    let music_dir = app_data_dir.join("music");

    client
        .download_playlist(
            &Identifier::Id(id),
            Some(music_dir.to_str().ok_or("Failed to get music dir")?),
            Some("/"),
        )
        .await
        .map_err(|e| {
            let app_error = handle_error(&state, &e);
            format_error_with_context("Failed to download playlist", app_error)
        })?;
    Ok(())
}
