import { z } from 'zod';

// ===== Utility Schemas =====
export const PagingCollectionSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
    z.object({
        collection: z.array(itemSchema),
    });

// ===== Search =====
export const SearchResultSchema = z.object({
    output: z.string().nullable(),
    query: z.string().nullable(),
});

export const SearchResultsResponseSchema =
    PagingCollectionSchema(SearchResultSchema);

// ===== Users =====
export const ProductSchema = z.object({
    id: z.string(),
});

export const CreatorSubscriptionWrapperSchema = z.object({
    product: ProductSchema,
});

export const VisualEntrySchema = z.object({
    urn: z.string().nullable(),
    entry_time: z.number().nullable(),
    visual_url: z.string().nullable(),
});

export const VisualsSchema = z.object({
    urn: z.string().nullable(),
    enabled: z.boolean().nullable(),
    visuals: z.array(VisualEntrySchema).nullable(),
});

export const BadgesSchema = z.object({
    pro: z.boolean().nullable(),
    creator_mid_tier: z.boolean().nullable(),
    pro_unlimited: z.boolean().nullable(),
    verified: z.boolean().nullable(),
});

export const DateOfBirthSchema = z.object({
    month: z.number().nullable(),
    year: z.number().nullable(),
    day: z.number().nullable(),
});

export const UserSummarySchema = z.object({
    id: z.number().nullable(),
    username: z.string().nullable(),
    permalink_url: z.string().nullable(),
    avatar_url: z.string().nullable(),
});

export const UserSchema = z.object({
    avatar_url: z.string().nullable(),
    city: z.string().nullable(),
    comments_count: z.number().nullable(),
    country_code: z.string().nullable(),
    created_at: z.string().nullable(),
    creator_subscriptions: z.array(CreatorSubscriptionWrapperSchema).nullable(),
    creator_subscription: CreatorSubscriptionWrapperSchema.nullable(),
    description: z.string().nullable(),
    followers_count: z.number().nullable(),
    followings_count: z.number().nullable(),
    first_name: z.string().nullable(),
    full_name: z.string().nullable(),
    groups_count: z.number().nullable(),
    id: z.number().nullable(),
    kind: z.string().nullable(),
    last_modified: z.string().nullable(),
    last_name: z.string().nullable(),
    likes_count: z.number().nullable(),
    playlist_likes_count: z.number().nullable(),
    permalink: z.string().nullable(),
    permalink_url: z.string().nullable(),
    playlist_count: z.number().nullable(),
    reposts_count: z.number().nullable(),
    track_count: z.number().nullable(),
    uri: z.string().nullable(),
    urn: z.string().nullable(),
    username: z.string().nullable(),
    verified: z.boolean().nullable(),
    visuals: VisualsSchema.nullable(),
    badges: BadgesSchema.nullable(),
    station_urn: z.string().nullable(),
    station_permalink: z.string().nullable(),
    date_of_birth: DateOfBirthSchema.nullable(),
});

// ===== Tracks =====
export const StreamTypeSchema = z.enum(['hls', 'progressive', 'none']);

export const TranscodingFormatSchema = z.object({
    protocol: StreamTypeSchema.nullable(),
    mime_type: z.string().nullable(),
});

export const TranscodingSchema = z.object({
    url: z.string().nullable(),
    preset: z.string().nullable(),
    duration: z.number().nullable(),
    snipped: z.boolean().nullable(),
    format: TranscodingFormatSchema.nullable(),
    quality: z.string().nullable(),
    is_legacy_transcoding: z.boolean().nullable(),
});

export const MediaSchema = z.object({
    transcodings: z.array(TranscodingSchema).nullable(),
});

export const PublisherMetadataSchema = z.object({
    id: z.number().nullable(),
    urn: z.string().nullable(),
    contains_music: z.boolean().nullable(),
});

export const TrackSchema = z.object({
    access: z.string().nullable(),
    artwork_url: z.string().nullable(),
    bpm: z.number().nullable(),
    comment_count: z.number().nullable(),
    created_at: z.string().nullable(),
    description: z.string().nullable(),
    download_url: z.string().nullable(),
    downloadable: z.boolean().nullable(),
    duration: z.number().nullable(),
    embeddable_by: z.string().nullable(),
    favoritings_count: z.number().nullable(),
    genre: z.string().nullable(),
    id: z.number().nullable(),
    isrc: z.string().nullable(),
    kind: z.string().nullable(),
    label_name: z.string().nullable(),
    license: z.string().nullable(),
    media: MediaSchema.nullable(),
    permalink_url: z.string().nullable(),
    playback_count: z.number().nullable(),
    publisher_metadata: PublisherMetadataSchema.nullable(),
    purchase_title: z.string().nullable(),
    purchase_url: z.string().nullable(),
    release: z.string().nullable(),
    release_day: z.number().nullable(),
    release_month: z.number().nullable(),
    release_year: z.number().nullable(),
    reposts_count: z.number().nullable(),
    sharing: z.string().nullable(),
    stream_url: z.string().nullable(),
    streamable: z.boolean().nullable(),
    tag_list: z.string().nullable(),
    title: z.string().nullable(),
    urn: z.string().nullable(),
    user: UserSummarySchema.nullable(),
    user_favorite: z.boolean().nullable(),
    user_playback_count: z.number().nullable(),
    waveform_url: z.string().nullable(),
});

export const TracksSchema = PagingCollectionSchema(TrackSchema);

export const StreamSchema = z.object({
    url: z.string().nullable(),
});

// ===== Playlists =====
export const PlaylistSchema = z.object({
    title: z.string().nullable(),
    id: z.number().nullable(),
    urn: z.string().nullable(),
    kind: z.string().nullable(),
    artwork_url: z.string().nullable(),
    created_at: z.string().nullable(),
    description: z.string().nullable(),
    downloadable: z.boolean().nullable(),
    duration: z.number().nullable(),
    ean: z.string().nullable(),
    embeddable_by: z.string().nullable(),
    genre: z.string().nullable(),
    label_id: z.number().nullable(),
    label_name: z.string().nullable(),
    last_modified: z.string().nullable(),
    license: z.string().nullable(),
    permalink: z.string().nullable(),
    permalink_url: z.string().nullable(),
    playlist_type: z.string().nullable(),
    purchase_title: z.string().nullable(),
    purchase_url: z.string().nullable(),
    release: z.string().nullable(),
    release_day: z.number().nullable(),
    release_month: z.number().nullable(),
    release_year: z.number().nullable(),
    sharing: z.string().nullable(),
    streamable: z.boolean().nullable(),
    tag_list: z.string().nullable(),
    track_count: z.number().nullable(),
    tracks: z.array(TrackSchema).nullable(),
    type: z.string().nullable(),
    uri: z.string().nullable(),
    user: UserSummarySchema.nullable(),
    user_id: z.number().nullable(),
    user_urn: z.string().nullable(),
    likes_count: z.number().nullable(),
    label: UserSummarySchema.nullable(),
    tracks_uri: z.string().nullable(),
    tags: z.string().nullable(),
    monetization_model: z.string().nullable(),
    policy: z.string().nullable(),
});

export const PlaylistsSchema = PagingCollectionSchema(PlaylistSchema);

// ===== Search All =====
export const SearchAllResultSchema = z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('track'), Track: TrackSchema }),
    z.object({ kind: z.literal('user'), User: UserSchema }),
    z.object({ kind: z.literal('playlist'), Playlist: PlaylistSchema }),
]);

export const SearchAllResponseSchema = PagingCollectionSchema(
    SearchAllResultSchema
);

// ===== Local Database =====
export const WaveformSchema = z.object({
    width: z.number(),
    height: z.number(),
    samples: z.array(z.number()),
});

export const TrackRowSchema = z.object({
    id: z.number(),
    title: z.string(),
    artist: z.string(),
    data: TrackSchema,
    waveform: WaveformSchema,
});

export const PlaylistRowSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const PlaylistSongRowSchema = z.object({
    id: z.number(),
    playlist_id: z.number(),
    track_id: z.number(),
    position: z.number(),
    added_at: z.string(),
    title: z.string(),
    artist: z.string(),
});

// ===== Error Schemas =====
// Matches Rust AppError variants
export const AppErrorTypeSchema = z.enum(['network', 'other']);

// Matches Rust ErrorResponse struct from src-tauri/src/commands/utils.rs
export const ErrorResponseSchema = z.object({
    type: AppErrorTypeSchema,
    message: z.string(),
});

// ===== Type exports from schemas =====

// Utility types
export type PagingCollection<T> = { collection: T[] };

// Search types
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type SearchResultsResponse = z.infer<typeof SearchResultsResponseSchema>;
export type SearchAllResult = z.infer<typeof SearchAllResultSchema>;
export type SearchAllResponse = z.infer<typeof SearchAllResponseSchema>;

// User types
export type Product = z.infer<typeof ProductSchema>;
export type CreatorSubscriptionWrapper = z.infer<
    typeof CreatorSubscriptionWrapperSchema
>;
export type VisualEntry = z.infer<typeof VisualEntrySchema>;
export type Visuals = z.infer<typeof VisualsSchema>;
export type Badges = z.infer<typeof BadgesSchema>;
export type DateOfBirth = z.infer<typeof DateOfBirthSchema>;
export type UserSummary = z.infer<typeof UserSummarySchema>;
export type User = z.infer<typeof UserSchema>;
export type Users = z.infer<
    ReturnType<typeof PagingCollectionSchema<typeof UserSchema>>
>;

// Track types
export type StreamType = z.infer<typeof StreamTypeSchema>;
export type TranscodingFormat = z.infer<typeof TranscodingFormatSchema>;
export type Transcoding = z.infer<typeof TranscodingSchema>;
export type Media = z.infer<typeof MediaSchema>;
export type PublisherMetadata = z.infer<typeof PublisherMetadataSchema>;
export type Track = z.infer<typeof TrackSchema>;
export type Tracks = z.infer<typeof TracksSchema>;
export type Stream = z.infer<typeof StreamSchema>;

// Playlist types
export type Playlist = z.infer<typeof PlaylistSchema>;
export type Playlists = z.infer<typeof PlaylistsSchema>;

// Local database types
export type Waveform = z.infer<typeof WaveformSchema>;
export type TrackRow = z.infer<typeof TrackRowSchema>;
export type PlaylistRow = z.infer<typeof PlaylistRowSchema>;
export type PlaylistSongRow = z.infer<typeof PlaylistSongRowSchema>;

// Error types
export type AppErrorType = z.infer<typeof AppErrorTypeSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
