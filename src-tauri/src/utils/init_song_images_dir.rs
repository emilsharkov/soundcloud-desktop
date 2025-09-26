use std::fs::create_dir_all;
use std::path::Path;

pub fn init_song_images_dir(app_data_dir: &Path) -> Result<(), String> {
    let song_image_dir = app_data_dir.join("song_images");
    if !song_image_dir.exists() {
        create_dir_all(song_image_dir)
            .map_err(|e| format!("Failed to create song image directory: {e}"))?;
    }
    Ok(())
}
