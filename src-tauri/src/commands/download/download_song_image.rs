use crate::models::app_state::AppState;
use image::ImageFormat;
use std::{fs::File, io::BufWriter, sync::Mutex};
use tauri::State;

#[tauri::command]
pub async fn download_song_image(
    state: State<'_, Mutex<AppState>>,
    url: String,
    id: String,
) -> Result<(), String> {
    let app_data_dir = state.lock().unwrap().app_data_dir.clone();
    let song_images_dir = app_data_dir.join("song_images");
    let path = song_images_dir.join(format!("{id}.png")); // ensure png extension
    if path.exists() {
        return Ok(());
    }

    // Fetch image bytes
    let response = reqwest::get(&url)
        .await
        .map_err(|e| format!("Failed to get image: {e}"))?;
    let bytes = response
        .bytes()
        .await
        .map_err(|e| format!("Failed to get bytes: {e}"))?;

    // Decode the image
    let img =
        image::load_from_memory(&bytes).map_err(|e| format!("Failed to decode image: {e}"))?;

    // Save as PNG
    let file = File::create(path).map_err(|e| format!("Failed to create file: {e}"))?;
    let writer = BufWriter::new(file);
    img.write_to(&mut std::io::BufWriter::new(writer), ImageFormat::Png)
        .map_err(|e| format!("Failed to save PNG: {e}"))?;

    Ok(())
}
