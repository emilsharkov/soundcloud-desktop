use crate::models::app_state::AppState;
use soundcloud_rs::{
    query::TracksQuery,
    response::{PagingCollection, Track},
};
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
pub async fn search_tracks(
    state: State<'_, Mutex<AppState>>,
    q: String,
) -> Result<PagingCollection<Track>, String> {
    let soundcloud_client = state.lock().unwrap().soundcloud_client.clone();
    let query = TracksQuery {
        q: Some(q),
        ..Default::default()
    };
    let tracks = soundcloud_client
        .search_tracks(Some(&query))
        .await
        .expect("Failed to get search results");
    Ok(tracks)
}
