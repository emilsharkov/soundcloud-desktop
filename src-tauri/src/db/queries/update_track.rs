use sqlx::SqlitePool;

pub async fn update_track(
    pool: &SqlitePool,
    id: &str,
    title: Option<&str>,
    artist: Option<&str>,
    artwork_url: Option<&str>,
) -> sqlx::Result<u64> {
    let result =
        sqlx::query("UPDATE tracks SET title = ?2, artist = ?3, artwork_url = ?4 WHERE id = ?1")
            .bind(id)
            .bind(title)
            .bind(artist)
            .bind(artwork_url)
            .execute(pool)
            .await?;
    Ok(result.rows_affected())
}
