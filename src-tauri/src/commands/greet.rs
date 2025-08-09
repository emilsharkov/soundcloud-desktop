use tauri::State;
use sqlx::SqlitePool;
use std::sync::Arc;

#[tauri::command]
pub fn greet(state: State<Arc<SqlitePool>>) -> String {
    println!("{:#?}", state);
    "Hello, world!".to_string()
}
