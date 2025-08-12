// Response models translated from soundcloud-rs (Rust) to TypeScript

// Generic paging collection
export interface PagingCollection<T> {
  collection: T[];
}

// ===== Search =====
export interface SearchResult {
  output?: string;
  query?: string;
}

export type SearchResultsResponse = PagingCollection<SearchResult>;

export type SearchAllResult =
  | { kind: 'track'; Track: Track }
  | { kind: 'user'; User: User }
  | { kind: 'playlist'; Playlist: Playlist };

export type SearchAllResponse = PagingCollection<SearchAllResult>;

// ===== Playlists =====
export interface Playlist {
  title?: string;
  id?: number;
  urn?: string;
  kind?: string;
  artwork_url?: string;
  created_at?: string;
  description?: string;
  downloadable?: boolean;
  duration?: number; // u64
  ean?: string;
  embeddable_by?: string;
  genre?: string;
  label_id?: number;
  label_name?: string;
  last_modified?: string;
  license?: string;
  permalink?: string;
  permalink_url?: string;
  playlist_type?: string;
  purchase_title?: string;
  purchase_url?: string;
  release?: string;
  release_day?: number;
  release_month?: number;
  release_year?: number;
  sharing?: string;
  streamable?: boolean;
  tag_list?: string;
  track_count?: number;
  tracks?: Track[];
  type?: string; // r#type
  uri?: string;
  user?: UserSummary;
  user_id?: number;
  user_urn?: string;
  likes_count?: number;
  label?: UserSummary;
  tracks_uri?: string;
  tags?: string;
  monetization_model?: string;
  policy?: string;
}

export type Playlists = PagingCollection<Playlist>;

// ===== Tracks =====
export interface Track {
  access?: string;
  artwork_url?: string;
  bpm?: number; // f64
  comment_count?: number; // u64
  created_at?: string;
  description?: string;
  download_url?: string;
  downloadable?: boolean;
  duration?: number; // u64
  embeddable_by?: string;
  favoritings_count?: number; // u64
  genre?: string;
  id?: number; // u64
  isrc?: string;
  kind?: string;
  label_name?: string;
  license?: string;
  media?: Media;
  permalink_url?: string;
  playback_count?: number; // u64
  publisher_metadata?: PublisherMetadata;
  purchase_title?: string;
  purchase_url?: string;
  release?: string;
  release_day?: number; // u32
  release_month?: number; // u32
  release_year?: number; // u32
  reposts_count?: number; // u64
  sharing?: string;
  stream_url?: string;
  streamable?: boolean;
  tag_list?: string;
  title?: string;
  urn?: string;
  user?: UserSummary;
  user_favorite?: boolean;
  user_playback_count?: number; // u64
  waveform_url?: string;
}

export interface PublisherMetadata {
  id?: number; // u64
  urn?: string;
  contains_music?: boolean;
}

export interface Media {
  transcodings?: Transcoding[];
}

export interface Transcoding {
  url?: string;
  preset?: string;
  duration?: number; // u64
  snipped?: boolean;
  format?: TranscodingFormat;
  quality?: string;
  is_legacy_transcoding?: boolean;
}

export interface TranscodingFormat {
  protocol?: StreamType;
  mime_type?: string;
}

export type StreamType = 'hls' | 'progressive' | 'none';

export interface Stream {
  url?: string;
}

export type Tracks = PagingCollection<Track>;

// ===== Users =====
export interface User {
  avatar_url?: string;
  city?: string;
  comments_count?: number; // u32
  country_code?: string;
  created_at?: string;
  creator_subscriptions?: CreatorSubscriptionWrapper[];
  creator_subscription?: CreatorSubscriptionWrapper;
  description?: string;
  followers_count?: number; // u32
  followings_count?: number; // u32
  first_name?: string;
  full_name?: string;
  groups_count?: number; // u32
  id?: number; // u64
  kind?: string;
  last_modified?: string;
  last_name?: string;
  likes_count?: number; // u32
  playlist_likes_count?: number; // u32
  permalink?: string;
  permalink_url?: string;
  playlist_count?: number; // u32
  reposts_count?: number; // u32
  track_count?: number; // u32
  uri?: string;
  urn?: string;
  username?: string;
  verified?: boolean;
  visuals?: Visuals;
  badges?: Badges;
  station_urn?: string;
  station_permalink?: string;
  date_of_birth?: DateOfBirth;
}

export interface CreatorSubscriptionWrapper {
  product: Product;
}

export interface Product {
  id: string;
}

export interface Visuals {
  urn?: string;
  enabled?: boolean;
  visuals?: VisualEntry[];
}

export interface VisualEntry {
  urn?: string;
  entry_time?: number; // u32
  visual_url?: string;
}

export interface Badges {
  pro?: boolean;
  creator_mid_tier?: boolean;
  pro_unlimited?: boolean;
  verified?: boolean;
}

export interface DateOfBirth {
  month?: number; // u8
  year?: number; // u16
  day?: number; // u8
}

export interface UserSummary {
  id?: number; // u64
  username?: string;
  permalink_url?: string;
  avatar_url?: string;
}

export type Users = PagingCollection<User>; 

export interface Waveform {
  width: number;
  height: number;
  samples: number[];
}