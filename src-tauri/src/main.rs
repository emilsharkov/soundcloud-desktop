// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
mod utils;
mod commands;

use db::setup::setup_database;
use commands::greet::greet;
use utils::init_app_data_dir::init_app_data_dir;
use tauri::Manager;


fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle().clone();
            let app_data_dir = app_handle.path().app_data_dir().expect("Failed to get app data dir");
            println!("app_data_dir: {}", app_data_dir.display());
            init_app_data_dir(&app_data_dir).expect("Failed to init app data dir");
            let db_pool = tauri::async_runtime::block_on(async {
                setup_database(&app_data_dir).await.expect("Failed to setup database")
            });
            app.manage(db_pool);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
