use id3::{
    frame::{Picture, PictureType},
    Tag, TagLike, Version,
};
use std::{
    fs::{self, File},
    path::PathBuf,
    sync::Mutex,
};
use tauri::{State, Url};

use crate::{
    db::queries::{update_track, TrackRow},
    models::app_state::AppState,
    utils::classify_path::{classify_path, InputType},
};

#[tauri::command]
pub async fn update_local_track_metadata(
    state: State<'_, Mutex<AppState>>,
    id: String,
    title: Option<String>,
    artist: Option<String>,
    artwork: Option<String>,
) -> Result<(), String> {
    let music_dir = state.lock().unwrap().app_data_dir.clone().join("music");
    let path = music_dir.join(&id).with_extension("mp3");
    let mut tag = Tag::read_from_path(&path).map_err(|e| format!("Failed to read tag: {e}"))?;

    if let Some(title) = title {
        tag.set_title(title);
    }

    if let Some(artist) = artist {
        tag.set_artist(artist);
    }

    if let Some(artwork) = artwork {
        match classify_path(&artwork) {
            InputType::Url(url) => {
                // Download image bytes (reqwest works nicely here)
                let bytes = reqwest::get(url)
                    .await
                    .map_err(|e| e.to_string())?
                    .bytes()
                    .await
                    .map_err(|e| e.to_string())?;
                tag.add_frame(Picture {
                    mime_type: "image/jpeg".to_string(), // or detect type
                    picture_type: PictureType::CoverFront,
                    description: String::new(),
                    data: bytes.to_vec(),
                });
            }
            InputType::Path(p) => {
                let bytes = fs::read(&p).map_err(|e| e.to_string())?;
                tag.add_frame(Picture {
                    mime_type: "image/jpeg".to_string(), // detect from extension ideally
                    picture_type: PictureType::CoverFront,
                    description: String::new(),
                    data: bytes,
                });
            }
            InputType::Invalid => {
                return Err("Invalid artwork path/url".into());
            }
        }
    }

    tag.write_to_path(&path, Version::Id3v24)
        .map_err(|e| format!("Failed to write tag: {e}"))?;
    Ok(())
}
