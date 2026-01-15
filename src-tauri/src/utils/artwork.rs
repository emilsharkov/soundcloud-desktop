use reqwest::Client;


/// Tries to use bigger artwork (t1080x1080) if available, falls back to original artwork URL
pub async fn get_artwork(artwork_url: &str) -> String {
    let bigger_artwork = artwork_url.replace("large", "t1080x1080");

    if bigger_artwork != artwork_url {
        // Check if the bigger artwork URL exists
        let client = Client::new();
        let response = client.head(&bigger_artwork).send().await;
        match response {
            Ok(resp) if resp.status().is_success() => bigger_artwork,
            _ => artwork_url.to_string(), // Fall back to original if bigger doesn't exist
        }
    } else {
        artwork_url.to_string() // No replacement happened, use original
    }
}