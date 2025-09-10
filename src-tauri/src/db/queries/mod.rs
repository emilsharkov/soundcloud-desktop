use sqlx::FromRow;

#[derive(Debug, FromRow, Clone)]
pub struct TrackRow {
    pub id: String,
    pub title: Option<String>,
    pub artist: Option<String>,
    pub artwork_url: Option<String>,
    pub data: Option<Vec<u8>>,
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
