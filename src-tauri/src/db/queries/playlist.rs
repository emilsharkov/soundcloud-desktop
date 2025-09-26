use super::{PlaylistRow, PlaylistSongRow};
use sqlx::SqlitePool;

pub async fn create_playlist(
    pool: &SqlitePool,
    id: &str,
    name: &str,
    position: i32,
) -> sqlx::Result<(), String> {
    sqlx::query(
        "INSERT INTO playlists (id, name, position) VALUES (?1, ?2, ?3)"
    )
    .bind(id)
    .bind(name)
    .bind(position)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to create playlist: {e}"))?;
    Ok(())
}

pub async fn get_playlists(
    pool: &SqlitePool,
    limit: Option<i64>,
    offset: Option<i64>,
) -> sqlx::Result<Vec<PlaylistRow>, String> {
    let limit = limit.unwrap_or(100);
    let offset = offset.unwrap_or(0);
    let rows = sqlx::query_as::<_, PlaylistRow>(
        "SELECT id, name, position FROM playlists ORDER BY position ASC LIMIT ?1 OFFSET ?2",
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await
    .map_err(|e| format!("Failed to get playlists: {e}"))?;
    Ok(rows)
}

pub async fn get_playlist(
    pool: &SqlitePool,
    id: &str,
) -> sqlx::Result<Option<PlaylistRow>, String> {
    let row = sqlx::query_as::<_, PlaylistRow>(
        "SELECT id, name, position FROM playlists WHERE id = ?1",
    )
    .bind(id)
    .fetch_optional(pool)
    .await
    .map_err(|e| format!("Failed to get playlist: {e}"))?;
    Ok(row)
}

pub async fn update_playlist(
    pool: &SqlitePool,
    id: &str,
    name: &str,
    position: i32,
) -> sqlx::Result<(), String> {
    sqlx::query(
        "UPDATE playlists SET name = ?1, position = ?2 WHERE id = ?3"
    )
    .bind(name)
    .bind(position)
    .bind(id)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to update playlist: {e}"))?;
    Ok(())
}

pub async fn delete_playlist(
    pool: &SqlitePool,
    id: &str,
) -> sqlx::Result<(), String> {
    sqlx::query("DELETE FROM playlists WHERE id = ?1")
        .bind(id)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to delete playlist: {e}"))?;
    Ok(())
}

pub async fn add_song_to_playlist(
    pool: &SqlitePool,
    playlist_id: &str,
    track_id: &str,
) -> sqlx::Result<(), String> {
    // Get the next position for this playlist
    let position: Option<i64> = sqlx::query_scalar(
        "SELECT COALESCE(MAX(position), 0) + 1 FROM playlist_songs WHERE playlist_id = ?1"
    )
    .bind(playlist_id)
    .fetch_optional(pool)
    .await
    .map_err(|e| format!("Failed to get next position: {e}"))?;

    let position = position.unwrap_or(1);

    sqlx::query(
        "INSERT INTO playlist_songs (id, playlist_id, track_id, position) VALUES (?1, ?2, ?3, ?4)"
    )
    .bind(format!("{}_{}", playlist_id, track_id))
    .bind(playlist_id)
    .bind(track_id)
    .bind(position)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to add song to playlist: {e}"))?;
    Ok(())
}

pub async fn remove_song_from_playlist(
    pool: &SqlitePool,
    playlist_id: &str,
    track_id: &str,
) -> sqlx::Result<(), String> {
    sqlx::query("DELETE FROM playlist_songs WHERE playlist_id = ?1 AND track_id = ?2")
        .bind(playlist_id)
        .bind(track_id)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to remove song from playlist: {e}"))?;
    Ok(())
}

pub async fn get_playlist_songs(
    pool: &SqlitePool,
    playlist_id: &str,
) -> sqlx::Result<Vec<PlaylistSongRow>, String> {
    let rows = sqlx::query_as::<_, PlaylistSongRow>(
        "SELECT ps.id, ps.playlist_id, ps.track_id, ps.position, t.title, t.artist 
         FROM playlist_songs ps 
         JOIN tracks t ON ps.track_id = t.id 
         WHERE ps.playlist_id = ?1 
         ORDER BY ps.position"
    )
    .bind(playlist_id)
    .fetch_all(pool)
    .await
    .map_err(|e| format!("Failed to get playlist songs: {e}"))?;
    Ok(rows)
}

pub async fn reorder_playlist_tracks(
    pool: &SqlitePool,
    playlist_id: &str,
    track_positions: Vec<(String, i32)>, // (track_id, new_position)
) -> sqlx::Result<(), String> {
    for (track_id, new_position) in track_positions {
        sqlx::query(
            "UPDATE playlist_songs SET position = ?1 WHERE playlist_id = ?2 AND track_id = ?3"
        )
        .bind(new_position)
        .bind(playlist_id)
        .bind(track_id)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to reorder track in playlist: {e}"))?;
    }
    Ok(())
}

pub async fn reorder_playlists(
    pool: &SqlitePool,
    playlist_positions: Vec<(String, i32)>, // (playlist_id, new_position)
) -> sqlx::Result<(), String> {
    for (playlist_id, new_position) in playlist_positions {
        sqlx::query(
            "UPDATE playlists SET position = ?1 WHERE id = ?2"
        )
        .bind(new_position)
        .bind(playlist_id)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to reorder playlist: {e}"))?;
    }
    Ok(())
}

