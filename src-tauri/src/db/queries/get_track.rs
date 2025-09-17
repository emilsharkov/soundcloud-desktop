use super::TrackRow;
use sqlx::SqlitePool;

pub async fn get_track(pool: &SqlitePool, id: &str) -> sqlx::Result<Option<TrackRow>, String> {
    let result = sqlx::query_as::<_, TrackRow>(
        "SELECT id, title, artist, data FROM tracks WHERE id = ?1",
    )
    .bind(id)
    .fetch_optional(pool)
    .await
    .map_err(|e| format!("Failed to get track: {e}"))?;

    if result.is_none() {
        return Err("Track not found".into());
    }
    
    Ok(result)
}
