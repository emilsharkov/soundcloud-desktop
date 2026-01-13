use std::fs;
use std::path::PathBuf;
use id3::{Tag, TagLike};

/// Sanitizes a filename or folder name by replacing invalid filesystem characters with underscores.
/// 
/// Invalid characters: `<`, `>`, `:`, `"`, `/`, `\`, `|`, `?`, `*`
pub fn sanitize_filename(name: &str) -> String {
    name.chars()
        .map(|c| match c {
            '<' | '>' | ':' | '"' | '/' | '\\' | '|' | '?' | '*' => '_',
            _ => c,
        })
        .collect()
}

/// Sanitizes a folder name by replacing invalid filesystem characters with underscores.
/// Same as sanitize_filename but kept separate for clarity.
pub fn sanitize_folder_name(name: &str) -> String {
    sanitize_filename(name)
}

/// Gets the export filename for a track, using the title from ID3 metadata if available,
/// otherwise falling back to the track ID.
/// 
/// # Arguments
/// * `source_path` - Path to the source MP3 file
/// * `id` - Track ID to use as fallback if no title is found
/// 
/// # Returns
/// A filename string with `.mp3` extension
pub fn get_export_filename(source_path: &PathBuf, id: u64) -> String {
    // Try to read title from ID3 metadata
    if let Ok(tag) = Tag::read_from_path(source_path) {
        if let Some(title) = tag.title() {
            let sanitized_title = sanitize_filename(title);
            if !sanitized_title.is_empty() {
                return format!("{}.mp3", sanitized_title);
            }
        }
    }
    
    // Fall back to track ID if no title found
    format!("{}.mp3", id)
}

/// Exports tracks to a destination folder.
/// 
/// # Arguments
/// * `track_ids` - Array of track IDs to export
/// * `music_dir` - Path to the music directory containing the source files
/// * `base_folder_path` - Base folder path where exports should be placed
/// * `subfolder_name` - Optional subfolder name to create (e.g., playlist name or "library")
/// 
/// # Returns
/// `Ok(())` if successful, or an error message
pub fn export_tracks(
    track_ids: &[u64],
    music_dir: &PathBuf,
    base_folder_path: &PathBuf,
    subfolder_name: Option<&str>,
) -> Result<(), String> {
    if track_ids.is_empty() {
        return Err("No tracks to export".to_string());
    }

    // Determine the export folder path
    let export_folder = if let Some(subfolder) = subfolder_name {
        let sanitized_name = sanitize_folder_name(subfolder);
        base_folder_path.join(sanitized_name)
    } else {
        base_folder_path.clone()
    };

    // Create the export folder if it doesn't exist
    fs::create_dir_all(&export_folder)
        .map_err(|e| format!("Failed to create export folder: {e}"))?;

    // Copy all track files
    for &track_id in track_ids {
        let source_path = music_dir.join(track_id.to_string()).with_extension("mp3");
        
        if source_path.exists() {
            // Get filename from metadata or fall back to track ID
            let file_name = get_export_filename(&source_path, track_id);
            
            fs::copy(
                &source_path,
                export_folder.join(&file_name),
            )
            .map_err(|e| format!("Failed to copy file {}: {e}", source_path.display()))?;
        }
    }

    Ok(())
}
