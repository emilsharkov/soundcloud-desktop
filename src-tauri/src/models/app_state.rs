use std::{
    path::PathBuf,
    sync::{atomic::AtomicBool, Arc},
};
pub struct AppState {
    pub db_pool: Arc<sqlx::SqlitePool>,
    pub soundcloud_client: Arc<Option<soundcloud_rs::Client>>,
    pub app_data_dir: Arc<PathBuf>,
    pub is_offline: Arc<AtomicBool>,
}
