use crate::{
    commands::{get_song_image, get_track, library::get_local_track},
    models::{app_state::AppState, TrackMediaMetadata},
};
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
pub async fn get_track_media_metadata(
    state: State<'_, Mutex<AppState>>,
    id: i64,
) -> Result<TrackMediaMetadata, String> {
    let track = get_local_track(state.clone(), id)
        .await
        .map_err(|e| format!("Failed to get local track: {e}"))
        .ok();
    if let Some(track) = track {
        let artwork = get_song_image(state.clone(), id)
            .await
            .map_err(|e| format!("Failed to get song image: {e}"))?;
        Ok(TrackMediaMetadata {
            title: track.title,
            artist: track.artist,
            artwork,
        })
    } else {
        let track = get_track(state.clone(), id)
            .await
            .map_err(|e| format!("Failed to get track: {e}"))?;
        return Ok(TrackMediaMetadata {
            title: track.title.ok_or("Failed to get title".to_string())?,
            artist: track
                .user
                .ok_or("Failed to get artist".to_string())?
                .username
                .ok_or("Failed to get username".to_string())?,
            artwork: get_song_image(state.clone(), id)
                .await
                .map_err(|e| format!("Failed to get song image: {e}"))?,
        });
    }
}
