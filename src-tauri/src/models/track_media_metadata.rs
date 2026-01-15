use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Default, Clone)]
pub struct TrackMediaMetadata {
    pub title: String,
    pub artist: String,
    pub artwork: String,
}
