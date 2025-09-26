use serde::{Deserialize, Serialize};
use soundcloud_rs::response::{Track, Waveform};
use sqlx::{types::Json, FromRow};

#[derive(Debug, FromRow, Clone, Serialize, Deserialize)]
pub struct TrackRow {
    pub id: String,
    pub title: String,
    pub artist: String,
    pub data: Json<Track>,
    pub waveform: Json<Waveform>,
}

#[derive(Debug, FromRow, Clone, Serialize, Deserialize)]
pub struct PlaylistRow {
    pub id: String,
    pub name: String,
    pub position: i32,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, FromRow, Clone, Serialize, Deserialize)]
pub struct PlaylistSongRow {
    pub id: String,
    pub playlist_id: String,
    pub track_id: String,
    pub position: i64,
    pub title: String,
    pub artist: String,
}

pub mod playlist;
pub mod track;

pub use playlist::*;
pub use track::*;
