use std::path::PathBuf;
use url::Url;

pub enum InputType {
    Url(Url),
    Path(PathBuf),
    Invalid,
}

pub fn classify_path(s: &str) -> InputType {
    if let Ok(url) = Url::parse(s) {
        return InputType::Url(url);
    }

    let path = PathBuf::from(s);
    if path.exists() {
        return InputType::Path(path);
    }

    InputType::Invalid
}
