use crate::{
    commands::update_local_track_metadata,
    commands::utils::{format_error_with_context, handle_error},
    db::queries::create_track,
    models::app_state::AppState,
};
use reqwest::Client;
use soundcloud_rs::Identifier;
use std::sync::Mutex;
use tauri::State;

/// Tries to use bigger artwork (t1080x1080) if available, falls back to original artwork URL
async fn get_best_artwork_url(artwork_url: &str) -> String {
    let bigger_artwork = artwork_url.replace("large", "t1080x1080");

    if bigger_artwork != artwork_url {
        // Check if the bigger artwork URL exists
        let client = Client::new();
        let response = client.head(&bigger_artwork).send().await;
        match response {
            Ok(resp) if resp.status().is_success() => bigger_artwork,
            _ => artwork_url.to_string(), // Fall back to original if bigger doesn't exist
        }
    } else {
        artwork_url.to_string() // No replacement happened, use original
    }
}

#[tauri::command]
pub async fn download_track(state: State<'_, Mutex<AppState>>, id: i64) -> Result<(), String> {
    let soundcloud_client = state.lock().unwrap().soundcloud_client.clone();
    let app_data_dir = state.lock().unwrap().app_data_dir.clone();
    let music_dir = app_data_dir.join("music");
    let client = soundcloud_client
        .as_ref()
        .as_ref()
        .ok_or("SoundCloud client is not available")?;
    let track = client.get_track(&Identifier::Id(id)).await.map_err(|e| {
        let app_error = handle_error(&state, &e);
        format_error_with_context("Failed to get track", app_error)
    })?;
    let track_title = track.title.as_ref().ok_or("Failed to get title")?;
    let track_username = track
        .user
        .as_ref()
        .ok_or("Failed to get user")?
        .username
        .as_ref()
        .ok_or("Failed to get username")?;

    let waveform = client
        .get_track_waveform(&Identifier::Id(id))
        .await
        .map_err(|e| {
            let app_error = handle_error(&state, &e);
            format_error_with_context("Failed to get track waveform", app_error)
        })?;

    // Download track
    client
        .download_track(
            &Identifier::Id(id),
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
        .map_err(|e| {
            let app_error = handle_error(&state, &e);
            format_error_with_context("Failed to download track", app_error)
        })?;

    // Add track metadata to mp3 file
    let artwork_url = track
        .artwork_url
        .as_ref()
        .ok_or("Failed to get artwork url")?
        .to_string();

    let final_artwork = get_best_artwork_url(&artwork_url).await;

    update_local_track_metadata(
        state.clone(),
        id,
        Some(track_title.to_string()),
        Some(track_username.to_string()),
        Some(final_artwork),
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
