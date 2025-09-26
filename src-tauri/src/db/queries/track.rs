use super::TrackRow;
use soundcloud_rs::response::{Track, Waveform};
use sqlx::types::Json;
use sqlx::SqlitePool;

pub async fn create_track(
    pool: &SqlitePool,
    id: &str,
    title: &str,
    artist: &str,
    track: &Track,
    waveform: &Waveform,
) -> sqlx::Result<(), String> {
    sqlx::query(
        "INSERT INTO tracks (id, title, artist, data, waveform) VALUES (?1, ?2, ?3, ?4, ?5)",
    )
    .bind(id)
    .bind(title)
    .bind(artist)
    .bind(Json(track.clone()))
    .bind(Json(waveform.clone()))
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to create track: {e}"))?;
    Ok(())
}

pub async fn get_track(pool: &SqlitePool, id: &str) -> sqlx::Result<Option<TrackRow>, String> {
    let result = sqlx::query_as::<_, TrackRow>(
        "SELECT id, title, artist, data, waveform FROM tracks WHERE id = ?1",
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

pub async fn get_tracks(
    pool: &SqlitePool,
    limit: Option<i64>,
    offset: Option<i64>,
) -> sqlx::Result<Vec<TrackRow>, String> {
    let limit = limit.unwrap_or(100);
    let offset = offset.unwrap_or(0);
    let rows = sqlx::query_as::<_, TrackRow>(
        "SELECT id, title, artist, data, waveform FROM tracks LIMIT ?1 OFFSET ?2",
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await
    .map_err(|e| format!("Failed to get tracks: {e}"))?;
    Ok(rows)
}

pub async fn update_track(
    pool: &SqlitePool,
    id: &str,
    title: Option<&str>,
    artist: Option<&str>,
    artwork_url: Option<&str>,
) -> sqlx::Result<(), String> {
    if title.is_none() && artist.is_none() && artwork_url.is_none() {
        return Err("No fields to update".into());
    }

    sqlx::query("UPDATE tracks SET title = ?2, artist = ?3 WHERE id = ?1 returning *")
        .bind(id)
        .bind(title)
        .bind(artist)
        .bind(artwork_url)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to update track: {e}"))?;
    Ok(())
}

pub async fn delete_track(pool: &SqlitePool, id: &str) -> sqlx::Result<(), String> {
    sqlx::query("DELETE FROM tracks WHERE id = ?1")
        .bind(id)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to delete track: {e}"))?;
    Ok(())
}
