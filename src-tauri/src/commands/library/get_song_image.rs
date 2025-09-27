use crate::models::app_state::AppState;
use base64::Engine as _;
use id3::Tag;
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
pub async fn get_song_image(state: State<'_, Mutex<AppState>>, id: i64) -> Result<String, String> {
    let music_dir = state.lock().unwrap().app_data_dir.clone().join("music");
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
