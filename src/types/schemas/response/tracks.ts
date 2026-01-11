import { z } from 'zod';
import { PagingCollectionSchema } from '../utils';
import { UserSummarySchema } from './users';

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

// ===== Type exports =====
export type StreamType = z.infer<typeof StreamTypeSchema>;
export type TranscodingFormat = z.infer<typeof TranscodingFormatSchema>;
export type Transcoding = z.infer<typeof TranscodingSchema>;
export type Media = z.infer<typeof MediaSchema>;
export type PublisherMetadata = z.infer<typeof PublisherMetadataSchema>;
export type Track = z.infer<typeof TrackSchema>;
export type Tracks = z.infer<typeof TracksSchema>;
export type Stream = z.infer<typeof StreamSchema>;
