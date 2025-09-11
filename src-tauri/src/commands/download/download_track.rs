use crate::{db::queries::create_track, models::app_state::AppState};
use soundcloud_rs::response::{StreamType, Track};
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
pub async fn download_track(
    state: State<'_, Mutex<AppState>>,
    track: Track,
    stream_type: Option<StreamType>,
) -> Result<(), String> {
    let soundcloud_client = state.lock().unwrap().soundcloud_client.clone();
    let app_data_dir = state.lock().unwrap().app_data_dir.clone();
    let music_dir = app_data_dir.join("music");
    soundcloud_client
        .download_track(
            &track,
            stream_type.as_ref(),
            Some(music_dir.to_str().expect("Failed to get music dir")),
            Some(
                track
                    .id
                    .expect("Failed to get track id")
                    .to_string()
                    .as_str(),
            ),
        )
        .await
        .expect("Failed to download track");

    let pool = state.lock().unwrap().db_pool.clone();
    let track_id = track.id.as_ref().expect("Failed to get track id").to_string();
    let track_title = track.title.as_ref().expect("Failed to get title");
    let track_username = track.user.as_ref().expect("Failed to get user").username.as_ref().expect("Failed to get username");
    create_track(
        &pool,
        &track_id,
        track_title,
        track_username,
        &track,
    )
    .await
    .expect("Failed to create track");
    Ok(())
}
