use sqlx::SqlitePool;

pub async fn create_track(
    pool: &SqlitePool,
    id: &str,
    title: Option<&str>,
    artist: Option<&str>,
    artwork_url: Option<&str>,
    data: Option<&[u8]>,
) -> sqlx::Result<u64> {
    let result = sqlx::query(
        "INSERT INTO tracks (id, title, artist, artwork_url, data) VALUES (?1, ?2, ?3, ?4, ?5)",
    )
    .bind(id)
    .bind(title)
    .bind(artist)
    .bind(artwork_url)
    .bind(data)
    .execute(pool)
    .await?;
    Ok(result.rows_affected())
}
