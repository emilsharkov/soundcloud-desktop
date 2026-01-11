use super::TrackRow;
use soundcloud_rs::response::{Track, Waveform};
use sqlx::types::Json;
use sqlx::SqlitePool;

pub async fn create_track(
    pool: &SqlitePool,
    id: i64,
    title: &str,
    artist: &str,
    track: &Track,
    waveform: &Waveform,
) -> sqlx::Result<(), String> {
    // Get the next position
    let position: Option<i64> = sqlx::query_scalar(
        "SELECT COALESCE(MAX(position), 0) + 1 FROM tracks",
    )
    .fetch_optional(pool)
    .await
    .map_err(|e| format!("Failed to get next position: {e}"))?;

    let position = position.unwrap_or(1) as i32;

    sqlx::query(
        "INSERT INTO tracks (id, title, artist, data, waveform, position) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
    )
    .bind(id)
    .bind(title)
    .bind(artist)
    .bind(Json(track.clone()))
    .bind(Json(waveform.clone()))
    .bind(position)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to create track: {e}"))?;
    Ok(())
}

pub async fn get_track(pool: &SqlitePool, id: i64) -> sqlx::Result<Option<TrackRow>, String> {
    let result = sqlx::query_as::<_, TrackRow>(
        "SELECT id, title, artist, data, waveform, position FROM tracks WHERE id = ?1",
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
        "SELECT id, title, artist, data, waveform, position FROM tracks ORDER BY COALESCE(position, id) ASC LIMIT ?1 OFFSET ?2",
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await
    .map_err(|e| format!("Failed to get tracks: {e}"))?;
    Ok(rows)
}

pub async fn reorder_tracks(
    pool: &SqlitePool,
    track_positions: Vec<(i64, i32)>, // (track_id, new_position)
) -> sqlx::Result<(), String> {
    for (track_id, new_position) in track_positions {
        sqlx::query("UPDATE tracks SET position = ?1 WHERE id = ?2")
            .bind(new_position)
            .bind(track_id)
            .execute(pool)
            .await
            .map_err(|e| format!("Failed to reorder track: {e}"))?;
    }
    Ok(())
}

pub async fn update_track(
    pool: &SqlitePool,
    id: i64,
    title: Option<&str>,
    artist: Option<&str>,
) -> sqlx::Result<(), String> {
    if title.is_none() && artist.is_none() {
        return Err("No fields to update".into());
    }

    println!("Updating track: {:?}", (title, artist, id));

    sqlx::query("UPDATE tracks SET title = ?1, artist = ?2 WHERE id = ?3")
        .bind(title)
        .bind(artist)
        .bind(id)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to update track: {e}"))?;

    let track = get_track(pool, id)
        .await
        .map_err(|e| format!("Failed to get track: {e}"))?;
    println!("Track updated: {track:?}");
    Ok(())
}

pub async fn delete_track(pool: &SqlitePool, id: i64) -> sqlx::Result<(), String> {
    sqlx::query("DELETE FROM tracks WHERE id = ?1")
        .bind(id)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to delete track: {e}"))?;
    Ok(())
}
