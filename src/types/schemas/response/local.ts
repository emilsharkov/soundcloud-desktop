import { z } from 'zod';
import { TrackSchema } from './tracks';

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

// ===== Command Response Schemas =====
export const GetSongImageResponseSchema = z.string();

export const GetLocalTrackResponseSchema = TrackRowSchema;

export const GetLocalTracksResponseSchema = z.array(TrackRowSchema);

export const DownloadTrackResponseSchema = z.void();

export const UpdateLocalTrackResponseSchema = z.void();

// ===== Type exports =====
export type Waveform = z.infer<typeof WaveformSchema>;
export type TrackRow = z.infer<typeof TrackRowSchema>;
export type PlaylistRow = z.infer<typeof PlaylistRowSchema>;
export type PlaylistSongRow = z.infer<typeof PlaylistSongRowSchema>;
export type GetSongImageResponse = z.infer<typeof GetSongImageResponseSchema>;
export type GetLocalTrackResponse = z.infer<typeof GetLocalTrackResponseSchema>;
export type GetLocalTracksResponse = z.infer<
    typeof GetLocalTracksResponseSchema
>;
export type DownloadTrackResponse = z.infer<typeof DownloadTrackResponseSchema>;
export type UpdateLocalTrackResponse = z.infer<
    typeof UpdateLocalTrackResponseSchema
>;
