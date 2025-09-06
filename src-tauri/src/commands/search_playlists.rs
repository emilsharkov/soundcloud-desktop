use crate::models::app_state::AppState;
use soundcloud_rs::{
    query::PlaylistsQuery,
    response::{PagingCollection},
    response::Playlist,
};
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
pub async fn search_playlists(
    state: State<'_, Mutex<AppState>>,
    q: String,
) -> Result<PagingCollection<Playlist>, String> {
    let soundcloud_client = state.lock().unwrap().soundcloud_client.clone();
    let query = PlaylistsQuery {
        q: Some(q),
        ..Default::default()
    };
    let playlists = soundcloud_client
        .search_playlists(Some(&query))
        .await
        .expect("Failed to get search playlists");
    Ok(playlists)
}
