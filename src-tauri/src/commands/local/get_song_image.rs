use id3::{Tag, TagLike};
use base64::Engine as _;
use std::sync::Mutex;
use tauri::State;
use crate::models::app_state::AppState;

#[tauri::command]
pub async fn get_song_image(
    state: State<'_, Mutex<AppState>>,
    id: String,
) -> Result<String, String> {
    let music_dir = state.lock().unwrap().app_data_dir.clone().join("music");
    let path = music_dir.join(&id).with_extension("mp3");
    let tag = Tag::read_from_path(&path).map_err(|e| format!("Failed to read tag: {e}"))?;
    let picture_opt = tag.pictures().next().cloned();
    if let Some(picture) = picture_opt {
        let b64 = base64::engine::general_purpose::STANDARD.encode(&picture.data);
        let mime = &picture.mime_type;
        let image = format!("data:{};base64,{}", mime, b64);
        Ok(image)
    } else {
        Err("No image found in ID3 metadata".to_string())
    }
}
