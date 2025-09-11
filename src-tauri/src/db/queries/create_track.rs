use soundcloud_rs::response::Track;
use sqlx::SqlitePool;

pub async fn create_track(
    pool: &SqlitePool,
    id: &str,
    title: &str,
    artist: &str,
    track: &Track,
) -> sqlx::Result<()> {
    let json = serde_json::to_string(track).expect("Failed to serialize track");
    sqlx::query(
        "INSERT INTO tracks (id, title, artist, data) VALUES (?1, ?2, ?3, jsonb(?4)) returning *",
    )
    .bind(id)
    .bind(title)
    .bind(artist)
    .bind(json)
    .execute(pool)
    .await?;
    Ok(())
}
