use crate::{
    commands::update_local_track_metadata, db::queries::create_track, models::app_state::AppState,
};
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
pub async fn download_track(state: State<'_, Mutex<AppState>>, id: i64) -> Result<(), String> {
    let soundcloud_client = state.lock().unwrap().soundcloud_client.clone();
    let app_data_dir = state.lock().unwrap().app_data_dir.clone();
    let music_dir = app_data_dir.join("music");

    // Get track metadata
    let track = soundcloud_client
        .get_track(&id)
        .await
        .map_err(|e| format!("Failed to get track: {e}"))?;
    let track_title = track.title.as_ref().ok_or("Failed to get title")?;
    let track_username = track
        .user
        .as_ref()
        .ok_or("Failed to get user")?
        .username
        .as_ref()
        .ok_or("Failed to get username")?;

    let waveform = soundcloud_client
        .get_track_waveform(&id)
        .await
        .map_err(|e| format!("Failed to get track waveform: {e}"))?;

    // Download track
    soundcloud_client
        .download_track(
            &id,
            None,
            Some(music_dir.to_str().ok_or("Failed to get music dir")?),
            Some(
                track
                    .id
                    .ok_or("Failed to get track id")?
                    .to_string()
                    .as_str(),
            ),
        )
        .await
        .map_err(|e| format!("Failed to download track: {e}"))?;

    // Add track metadata to mp3 file
    update_local_track_metadata(
        state.clone(),
        id,
        Some(track_title.to_string()),
        Some(track_username.to_string()),
        Some(
            track
                .artwork_url
                .as_ref()
                .ok_or("Failed to get artwork url")?
                .to_string(),
        ),
    )
    .await
    .map_err(|e| format!("Failed to update local track metadata: {e}"))?;

    // Add track to database
    let pool = state.lock().unwrap().db_pool.clone();
    create_track(&pool, id, track_title, track_username, &track, &waveform)
        .await
        .map_err(|e| format!("Failed to create track: {e}"))?;

    Ok(())
}
