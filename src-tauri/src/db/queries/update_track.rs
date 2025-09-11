use sqlx::SqlitePool;

pub async fn update_track(
    pool: &SqlitePool,
    id: &str,
    title: Option<&str>,
    artist: Option<&str>,
    artwork_url: Option<&str>,
) -> sqlx::Result<()> {
    sqlx::query("UPDATE tracks SET title = ?2, artist = ?3 WHERE id = ?1 returning *")
        .bind(id)
        .bind(title)
        .bind(artist)
        .bind(artwork_url)
        .execute(pool)
        .await?;
    Ok(())
}
