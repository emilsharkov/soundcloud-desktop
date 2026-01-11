import { z } from 'zod';
import { PagingCollectionSchema } from '../utils';
import { TrackSchema } from './tracks';
import { UserSummarySchema } from './users';

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

// ===== Type exports =====
export type Playlist = z.infer<typeof PlaylistSchema>;
export type Playlists = z.infer<typeof PlaylistsSchema>;
