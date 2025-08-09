use std::{fs::create_dir_all, path::Path};

pub fn init_app_data_dir(app_data_dir: &Path) -> Result<(), String> {
    if !Path::new(&app_data_dir).exists() {
        create_dir_all(app_data_dir).expect("Failed to create db directory");
    }
    Ok(())
}
