use sqlx::{types::Json, FromRow};
use serde_json::Value;
use serde::{Deserialize, Serialize};

#[derive(Debug, FromRow, Clone, Serialize, Deserialize)]
pub struct TrackRow {
    pub id: String,
    pub title: String,
    pub artist: String,
    pub data: Json<Value>,
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
