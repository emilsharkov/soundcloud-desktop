use super::TrackRow;
use sqlx::SqlitePool;

pub async fn get_tracks(
    pool: &SqlitePool,
    limit: Option<i64>,
    offset: Option<i64>,
) -> sqlx::Result<Vec<TrackRow>, String> {
    let limit = limit.unwrap_or(100);
    let offset = offset.unwrap_or(0);
    let rows = sqlx::query_as::<_, TrackRow>(
        "SELECT id, title, artist, data FROM tracks LIMIT ?1 OFFSET ?2",
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await
    .map_err(|e| format!("Failed to get tracks: {e}"))?;
    Ok(rows)
}   
