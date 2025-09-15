use std::{
    fs::create_dir_all,
    path::Path,
};

pub fn init_music_dir(app_data_dir: &Path) -> Result<(), String> {
    let music_dir = app_data_dir.join("music");
    if !music_dir.exists() {
        create_dir_all(music_dir).map_err(|e| format!("Failed to create music directory: {e}"))?;
    }
    Ok(())
}
