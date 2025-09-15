use std::path::Path;

use crate::utils::constants::DB_PATH;
use sqlx::{migrate::Migrator, sqlite::SqliteConnectOptions, SqlitePool};

static MIGRATOR: Migrator = sqlx::migrate!("./src/db/migrations");

pub async fn setup_database(app_data_dir: &Path) -> Result<SqlitePool, String> {
    let db_path = app_data_dir.join(DB_PATH);
    let opts = SqliteConnectOptions::new()
        .filename(db_path)
        .create_if_missing(true);
    let db_pool = sqlx::SqlitePool::connect_with(opts)
        .await
        .map_err(|e| format!("Failed to connect to db: {e}"))?;
    MIGRATOR
        .run(&db_pool)
        .await
        .map_err(|e| format!("Failed to run migrations: {e}"))?;
    Ok(db_pool)
}
