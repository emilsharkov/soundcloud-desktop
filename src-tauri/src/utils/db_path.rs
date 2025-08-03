use tauri::api::path::app_data_dir;
use std::path::PathBuf;
use tauri::AppHandle;

pub fn get_db_path(app: &AppHandle) -> PathBuf {
    let mut path = app_data_dir(&app.config()).expect("Could not resolve app data dir");
    path.push("database.sqlite");
    path
}