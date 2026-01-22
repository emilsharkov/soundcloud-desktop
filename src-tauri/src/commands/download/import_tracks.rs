use serde::Serialize;
use std::sync::Mutex;
use tauri::State;

use crate::{
    commands::{
        download::download_track_internal,
        utils::{check_offline_mode, format_error_with_context},
    },
    models::app_state::AppState,
};

#[derive(Serialize)]
pub struct ImportTracksResult {
    pub imported: usize,
    pub failed_count: usize,
}

#[tauri::command]
pub async fn import_tracks(
    state: State<'_, Mutex<AppState>>,
    ids: Vec<i64>,
) -> Result<ImportTracksResult, String> {
    check_offline_mode(state.inner())
        .map_err(|e| format_error_with_context("App is in offline mode", e))?;

    let mut imported = 0;
    let mut failed_count = 0;

    for id in ids {
        match download_track_internal(state.inner(), id).await {
            Ok(()) => {
                imported += 1;
            }
            Err(error) => {
                eprintln!("Failed to import track {}: {}", id, error);
                failed_count += 1;
            }
        }
    }

    Ok(ImportTracksResult {
        imported,
        failed_count,
    })
}
