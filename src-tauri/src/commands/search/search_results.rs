use crate::models::app_state::AppState;
use soundcloud_rs::{
    query::SearchResultsQuery,
    response::{PagingCollection, SearchResult},
};
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
pub async fn search_results(
    state: State<'_, Mutex<AppState>>,
    q: String,
) -> Result<PagingCollection<SearchResult>, String> {
    let soundcloud_client = state.lock().unwrap().soundcloud_client.clone();
    let query = SearchResultsQuery {
        q: Some(q),
        ..Default::default()
    };
    let search_results = soundcloud_client
        .get_search_results(Some(&query))
        .await
        .expect("Failed to get search results");
    Ok(search_results)
}
