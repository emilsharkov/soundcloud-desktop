use serde::{Deserialize, Serialize};
use tauri::State;
use std::sync::Arc;
use crate::models::app_state::AppState;
use soundcloud_rs::{query::SearchResultsQuery, response::{PagingCollection}};

#[derive(Debug, Deserialize, Serialize, Default, Clone)]
pub struct SearchResult {
    pub output: Option<String>,
    pub query: Option<String>,
}

#[tauri::command]
pub async fn greet(state: State<'_,Arc<AppState>>, q: String) -> Result<PagingCollection<SearchResult>, String> {
    let query = SearchResultsQuery {
        q: Some(q),
        ..Default::default()
    };
    let search_results = PagingCollection { collection: vec![
        
    ] };
    // let search_results = state.soundcloud_client.get_search_results(Some(&query)).await.expect("Failed to get search results");
    Ok(search_results)
}

