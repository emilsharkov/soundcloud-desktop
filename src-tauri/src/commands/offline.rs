use crate::models::app_state::AppState;
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
pub fn get_offline_mode(state: State<'_, Mutex<AppState>>) -> bool {
    state
        .lock()
        .unwrap()
        .is_offline
        .load(std::sync::atomic::Ordering::Relaxed)
}

#[tauri::command]
pub fn set_offline_mode(state: State<'_, Mutex<AppState>>, offline: bool) {
    state
        .lock()
        .unwrap()
        .is_offline
        .store(offline, std::sync::atomic::Ordering::Relaxed);
}

#[tauri::command]
pub async fn test_connectivity(state: State<'_, Mutex<AppState>>) -> Result<bool, String> {
    // First, try to use existing client's health_check
    let soundcloud_client = state.lock().unwrap().soundcloud_client.clone();
    if let Some(client) = soundcloud_client.as_ref() {
        let is_healthy = client.health_check().await;
        if is_healthy {
            // Health check passed, we're online
            state
                .lock()
                .unwrap()
                .is_offline
                .store(false, std::sync::atomic::Ordering::Relaxed);
            return Ok(true);
        }
    }

    // If no client exists or health_check failed, try to create a new client
    let client_result = soundcloud_rs::ClientBuilder::new()
        .with_max_retries(1)
        .with_retry_on_401(true)
        .build()
        .await;

    let is_online = client_result.is_ok();

    // If we're back online, update the client and clear offline mode
    if is_online {
        let mut app_state = state.lock().unwrap();
        app_state.soundcloud_client = std::sync::Arc::new(client_result.ok());
        app_state
            .is_offline
            .store(false, std::sync::atomic::Ordering::Relaxed);
    }

    Ok(is_online)
}
