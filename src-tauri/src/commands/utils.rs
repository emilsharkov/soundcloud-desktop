use crate::models::app_state::AppState;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

/// Error type to differentiate between network and other errors
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AppError {
    Network(String),
    Other(String),
}

/// Error response structure for JSON serialization
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ErrorResponse {
    #[serde(rename = "type")]
    pub error_type: String,
    pub message: String,
}

impl From<AppError> for String {
    fn from(err: AppError) -> Self {
        let error_response = match &err {
            AppError::Network(msg) => ErrorResponse {
                error_type: "network".to_string(),
                message: msg.clone(),
            },
            AppError::Other(msg) => ErrorResponse {
                error_type: "other".to_string(),
                message: msg.clone(),
            },
        };
        serde_json::to_string(&error_response).unwrap_or_else(|_| match err {
            AppError::Network(msg) => format!(
                "{{\"type\":\"network\",\"message\":\"{}\"}}",
                msg.replace('"', "\\\"")
            ),
            AppError::Other(msg) => format!(
                "{{\"type\":\"other\",\"message\":\"{}\"}}",
                msg.replace('"', "\\\"")
            ),
        })
    }
}

/// Formats an error with context into a JSON error response string
pub fn format_error_with_context(context: &str, app_error: AppError) -> String {
    let error_response = match &app_error {
        AppError::Network(msg) => ErrorResponse {
            error_type: "network".to_string(),
            message: format!("{}: {}", context, msg),
        },
        AppError::Other(msg) => ErrorResponse {
            error_type: "other".to_string(),
            message: format!("{}: {}", context, msg),
        },
    };
    serde_json::to_string(&error_response).unwrap_or_else(|_| match app_error {
        AppError::Network(msg) => format!(
            "{{\"type\":\"network\",\"message\":\"{}: {}\"}}",
            context.replace('"', "\\\""),
            msg.replace('"', "\\\"")
        ),
        AppError::Other(msg) => format!(
            "{{\"type\":\"other\",\"message\":\"{}: {}\"}}",
            context.replace('"', "\\\""),
            msg.replace('"', "\\\"")
        ),
    })
}

/// Checks if an error is a network-related error and sets offline mode if so.
/// Returns the error type (network or other).
pub fn handle_error(state: &Mutex<AppState>, error: &soundcloud_rs::Error) -> AppError {
    let error_string = format!("{}", error);

    // Check if it's a network-related error
    // Common network error indicators: connection, timeout, network, dns, tcp, http error codes
    let is_network_error = error_string.to_lowercase().contains("connection")
        || error_string.to_lowercase().contains("timeout")
        || error_string.to_lowercase().contains("network")
        || error_string.to_lowercase().contains("dns")
        || error_string.to_lowercase().contains("tcp")
        || error_string.to_lowercase().contains("failed to connect")
        || error_string.to_lowercase().contains("no route to host")
        || error_string.to_lowercase().contains("connection refused")
        || error_string.to_lowercase().contains("connection reset")
        || error_string.to_lowercase().contains("connection aborted");

    if is_network_error {
        state
            .lock()
            .unwrap()
            .is_offline
            .store(true, std::sync::atomic::Ordering::Relaxed);
        eprintln!("Network error: {}", error);
        AppError::Network(error_string)
    } else {
        eprintln!("Other error: {}", error);
        AppError::Other(error_string)
    }
}

/// Checks if the app is in offline mode and returns an error if so.
pub fn check_offline_mode(state: &Mutex<AppState>) -> Result<(), AppError> {
    if state
        .lock()
        .unwrap()
        .is_offline
        .load(std::sync::atomic::Ordering::Relaxed)
    {
        Err(AppError::Network(
            "App is in offline mode. Please check your internet connection.".to_string(),
        ))
    } else {
        Ok(())
    }
}
