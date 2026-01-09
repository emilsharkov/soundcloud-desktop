use crate::{
    commands::utils::{check_offline_mode, format_error_with_context, handle_error},
    models::app_state::AppState,
};
use soundcloud_rs::{query::PlaylistsQuery, response::PagingCollection, response::Playlist};
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
pub async fn search_playlists(
    state: State<'_, Mutex<AppState>>,
    q: String,
) -> Result<PagingCollection<Playlist>, String> {
    check_offline_mode(&state).map_err(|e| format_error_with_context("App is in offline mode", e))?;

    let soundcloud_client = state.lock().unwrap().soundcloud_client.clone();
    let client = soundcloud_client
        .as_ref()
        .as_ref()
        .ok_or("SoundCloud client is not available")?;
    let query = PlaylistsQuery {
        q: Some(q),
        ..Default::default()
    };
    let playlists = client.search_playlists(Some(&query)).await.map_err(|e| {
        let app_error = handle_error(&state, &e);
        format_error_with_context("Failed to get search playlists", app_error)
    })?;
    Ok(playlists)
}
