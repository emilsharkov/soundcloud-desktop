use id3::{
    frame::{Picture, PictureType},
    Tag, TagLike, Version,
};
use std::{
    fs::{self},
    path::Path,
    sync::Mutex,
};
use tauri::State;

use crate::{
    models::app_state::AppState,
    utils::classify_path::{classify_path, InputType},
};

fn detect_mime_type_from_path(path: &Path) -> String {
    match path.extension().and_then(|ext| ext.to_str()) {
        Some("jpg") | Some("jpeg") => "image/jpeg".to_string(),
        Some("png") => "image/png".to_string(),
        Some("gif") => "image/gif".to_string(),
        Some("bmp") => "image/bmp".to_string(),
        Some("webp") => "image/webp".to_string(),
        Some("tiff") | Some("tif") => "image/tiff".to_string(),
        _ => "image/jpeg".to_string(), // Default fallback
    }
}

fn detect_mime_type_from_url(url_str: &str) -> String {
    // Try to parse the URL and extract the path
    if let Ok(parsed_url) = url::Url::parse(url_str) {
        detect_mime_type_from_path(Path::new(parsed_url.path()))
    } else {
        // If URL parsing fails, try to extract extension from the string directly
        if let Some(last_dot) = url_str.rfind('.') {
            let extension = &url_str[last_dot + 1..];
            match extension.to_lowercase().as_str() {
                "jpg" | "jpeg" => "image/jpeg".to_string(),
                "png" => "image/png".to_string(),
                "gif" => "image/gif".to_string(),
                "bmp" => "image/bmp".to_string(),
                "webp" => "image/webp".to_string(),
                "tiff" | "tif" => "image/tiff".to_string(),
                _ => "image/jpeg".to_string(), // Default fallback
            }
        } else {
            "image/jpeg".to_string() // Default fallback
        }
    }
}

#[tauri::command]
pub async fn update_local_track_metadata(
    state: State<'_, Mutex<AppState>>,
    id: i64,
    title: Option<String>,
    artist: Option<String>,
    artwork: Option<String>,
) -> Result<(), String> {
    let music_dir = state.lock().unwrap().app_data_dir.clone().join("music");
    let path = music_dir.join(id.to_string()).with_extension("mp3");
    let mut tag = Tag::read_from_path(&path).unwrap_or_else(|_| Tag::new());

    if let Some(title) = title {
        tag.set_title(title);
    }

    if let Some(artist) = artist {
        tag.set_artist(artist);
    }

    if let Some(artwork) = artwork {
        match classify_path(&artwork) {
            InputType::Url(url) => {
                // Get URL string before moving the URL object
                let url_str = url.as_str().to_string();
                let url_clone = url.clone();

                // Download image bytes (reqwest works nicely here)
                let bytes = reqwest::get(url_clone)
                    .await
                    .map_err(|e| format!("Failed to download artwork from URL: {e}"))?
                    .bytes()
                    .await
                    .map_err(|e| format!("Failed to read artwork bytes from URL: {e}"))?;

                // Try to detect MIME type from URL
                let mime_type = detect_mime_type_from_url(&url_str);

                tag.add_frame(Picture {
                    mime_type,
                    picture_type: PictureType::CoverFront,
                    description: String::new(),
                    data: bytes.to_vec(),
                });
            }
            InputType::Path(p) => {
                // Read image bytes from local file
                let bytes =
                    fs::read(&p).map_err(|e| format!("Failed to read artwork file: {e}"))?;

                // Detect MIME type from file path
                let mime_type = detect_mime_type_from_path(&p);

                tag.add_frame(Picture {
                    mime_type,
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
