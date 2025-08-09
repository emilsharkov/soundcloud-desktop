use std::{path::Path, sync::Arc};

use sqlx::{migrate::Migrator, sqlite::{SqliteConnectOptions}};
use crate::utils::constants::{DB_PATH};

static MIGRATOR: Migrator = sqlx::migrate!("./src/db/migrations");

pub async fn setup_database(app_data_dir: &Path) -> Result<Arc<sqlx::SqlitePool>, String> {
    let db_path = app_data_dir.join(DB_PATH);
    let opts = SqliteConnectOptions::new().filename(db_path).create_if_missing(true);
    let db_pool = sqlx::SqlitePool::connect_with(opts).await.expect("Failed to connect to db");
    MIGRATOR.run(&db_pool).await.expect("Failed to run migrations");
    Ok(Arc::new(db_pool))
}

