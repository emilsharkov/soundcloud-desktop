use std::{path::PathBuf, sync::Arc};
pub struct AppState {
    pub db_pool: Arc<sqlx::SqlitePool>,
    pub soundcloud_client: Arc<soundcloud_rs::Client>,
    pub app_data_dir: Arc<PathBuf>,
}
