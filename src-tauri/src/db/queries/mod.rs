use sqlx::FromRow;
use serde_json::Value;
use serde::Serialize;

#[derive(Debug, FromRow, Clone, Serialize)]
pub struct TrackRow {
    pub id: String,
    pub title: Option<String>,
    pub artist: Option<String>,
    pub data: Option<Value>,
}

pub mod create_track;
pub mod delete_track;
pub mod get_track;
pub mod get_tracks;
pub mod update_track;

pub use create_track::create_track;
pub use delete_track::delete_track;
pub use get_track::get_track;
pub use get_tracks::get_tracks;
pub use update_track::update_track;
