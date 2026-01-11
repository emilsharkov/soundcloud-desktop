use serde::{Deserialize, Serialize};
use soundcloud_rs::response::{Track, Waveform};
use sqlx::{types::Json, FromRow};

#[derive(Debug, FromRow, Clone, Serialize, Deserialize)]
pub struct TrackRow {
    pub id: u64,
    pub title: String,
    pub artist: String,
    pub data: Json<Track>,
    pub waveform: Json<Waveform>,
    pub position: Option<i32>,
}

#[derive(Debug, FromRow, Clone, Serialize, Deserialize)]
pub struct PlaylistRow {
    pub id: u64,
    pub name: String,
    pub position: i32,
}

#[derive(Debug, FromRow, Clone, Serialize, Deserialize)]
pub struct PlaylistSongRow {
    pub id: u64,
    pub playlist_id: u64,
    pub track_id: u64,
    pub position: i64,
    pub title: String,
    pub artist: String,
}

pub mod playlist;
pub mod track;

pub use playlist::*;
pub use track::*;
