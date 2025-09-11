use super::TrackRow;
use sqlx::SqlitePool;

pub async fn get_track(pool: &SqlitePool, id: &str) -> sqlx::Result<Option<TrackRow>> {
    let result = sqlx::query_as::<_, TrackRow>(
        "SELECT id, title, artist, json(data) FROM tracks WHERE id = ?1",
    )
    .bind(id)
    .fetch_optional(pool)
    .await
    .expect("Failed to get track");
    Ok(result)
}
