use std::sync::Mutex;
use tauri::State;

use crate::{
    commands::local::update_local_track_metadata,
    db::queries::{update_track, TrackRow},
    models::app_state::AppState,
};

#[tauri::command]
pub async fn update_local_track(
    state: State<'_, Mutex<AppState>>,
    id: String,
    title: Option<String>,
    artist: Option<String>,
    artwork: Option<String>,
) -> Result<(), String> {
    update_local_track_metadata(
        state.clone(),
        id.clone(),
        title.clone(),
        artist.clone(),
        artwork.clone(),
    )
    .await
    .map_err(|e| format!("Failed to update track metadata: {e}"))?;

    let pool = state.lock().unwrap().db_pool.clone();
    update_track(
        &pool,
        &id,
        title.as_deref(),
        artist.as_deref(),
        artwork.as_deref(),
    )
    .await
    .map_err(|e| format!("Failed to update track: {e}"))?;
    Ok(())
}
