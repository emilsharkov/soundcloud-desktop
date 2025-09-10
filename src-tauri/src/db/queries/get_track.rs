use super::TrackRow;
use sqlx::SqlitePool;

pub async fn get_track(pool: &SqlitePool, id: &str) -> sqlx::Result<Option<TrackRow>> {
    sqlx::query_as::<_, TrackRow>(
        "SELECT id, title, artist, artwork_url, data FROM tracks WHERE id = ?1",
    )
    .bind(id)
    .fetch_optional(pool)
    .await
}
