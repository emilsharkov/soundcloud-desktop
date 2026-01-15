use crate::{
    commands::{
        get_local_track,
        utils::{check_offline_mode, format_error_with_context, handle_error},
    },
    models::app_state::AppState,
    utils::get_artwork,
};
use base64::Engine as _;
use id3::Tag;
use soundcloud_rs::{Identifier, Track};
use std::{path::PathBuf, sync::Mutex};
use tauri::State;

#[tauri::command]
pub async fn get_song_image(state: State<'_, Mutex<AppState>>, id: i64) -> Result<String, String> {
    let local_track = get_local_track(state.clone(), id).await.ok();

    if local_track.is_some() {
        let music_dir = state.lock().unwrap().app_data_dir.clone().join("music");
        get_image_from_local_track(music_dir, id).await
    } else {
        check_offline_mode(&state)
            .map_err(|e| format_error_with_context("App is in offline mode", e))?;
        let soundcloud_client = state.lock().unwrap().soundcloud_client.clone();
        let client = soundcloud_client
            .as_ref()
            .as_ref()
            .ok_or("SoundCloud client is not available")?;
        let track = client.get_track(&Identifier::Id(id)).await.map_err(|e| {
            let app_error = handle_error(&state, &e);
            format_error_with_context("Failed to get track", app_error)
        })?;
        return get_image_from_online_track(&track).await;
    }
}

async fn get_image_from_local_track(music_dir: PathBuf, id: i64) -> Result<String, String> {
    let path = music_dir.join(id.to_string()).with_extension("mp3");
    let tag = Tag::read_from_path(&path).map_err(|e| format!("Failed to read tag: {e}"))?;
    let picture_opt = tag.pictures().next().cloned();
    if let Some(picture) = picture_opt {
        let b64 = base64::engine::general_purpose::STANDARD.encode(&picture.data);
        let mime = &picture.mime_type;
        let image = format!("data:{mime};base64,{b64}");
        Ok(image)
    } else {
        Err("No image found in ID3 metadata".to_string())
    }
}

async fn get_image_from_online_track(track: &Track) -> Result<String, String> {
    let artwork_url = track
        .artwork_url
        .as_ref()
        .ok_or("Failed to get artwork url")?;
    let artwork = get_artwork(artwork_url).await;
    Ok(artwork)
}
