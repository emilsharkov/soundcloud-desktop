use sqlx::SqlitePool;

pub async fn delete_track(pool: &SqlitePool, id: &str) -> sqlx::Result<(), String> {
    sqlx::query("DELETE FROM tracks WHERE id = ?1")
        .bind(id)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to delete track: {e}"))?;
    Ok(())
}
