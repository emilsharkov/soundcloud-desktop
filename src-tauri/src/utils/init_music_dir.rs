use std::{
    fs::create_dir_all,
    path::{Path, PathBuf},
};

pub fn init_music_dir(app_data_dir: &Path) -> Result<(), String> {
    let music_dir = app_data_dir.join("music");
    if !music_dir.exists() {
        create_dir_all(music_dir).expect("Failed to create music directory");
    }
    Ok(())
}
