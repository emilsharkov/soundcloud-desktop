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
    position: z.number().nullable(),
});

export const PlaylistRowSchema = z.object({
    id: z.number(),
    name: z.string(),
    position: z.number(),
});

export const PlaylistSongRowSchema = z.object({
    id: z.number(),
    playlist_id: z.number(),
    track_id: z.number(),
    position: z.number(),
    title: z.string(),
    artist: z.string(),
});

// ===== Command Response Schemas =====
export const GetSongImageResponseSchema = z.string();

export const GetLocalTrackResponseSchema = TrackRowSchema;

export const GetLocalTracksResponseSchema = z.array(TrackRowSchema);

export const DownloadTrackResponseSchema = z.null();

export const UpdateLocalTrackResponseSchema = z.null();

export const GetPlaylistsResponseSchema = z.array(PlaylistRowSchema);
export const GetPlaylistResponseSchema = PlaylistRowSchema.nullable();
export const GetPlaylistSongsResponseSchema = z.array(PlaylistSongRowSchema);
export const CreatePlaylistResponseSchema = z.null();
export const UpdatePlaylistResponseSchema = z.null();
export const DeletePlaylistResponseSchema = z.null();
export const DeleteLocalTrackResponseSchema = z.null();
export const AddSongToPlaylistResponseSchema = z.null();
export const RemoveSongFromPlaylistResponseSchema = z.null();
export const ReorderPlaylistsResponseSchema = z.null();
export const ReorderPlaylistTracksResponseSchema = z.null();
export const ReorderTracksResponseSchema = z.null();

export const ExportSongResponseSchema = z.null();
export const ExportLibraryResponseSchema = z.null();
export const ExportPlaylistResponseSchema = z.null();

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
export type GetPlaylistsResponse = z.infer<typeof GetPlaylistsResponseSchema>;
export type GetPlaylistResponse = z.infer<typeof GetPlaylistResponseSchema>;
export type GetPlaylistSongsResponse = z.infer<
    typeof GetPlaylistSongsResponseSchema
>;
export type CreatePlaylistResponse = z.infer<
    typeof CreatePlaylistResponseSchema
>;
export type UpdatePlaylistResponse = z.infer<
    typeof UpdatePlaylistResponseSchema
>;
export type DeletePlaylistResponse = z.infer<
    typeof DeletePlaylistResponseSchema
>;
export type DeleteLocalTrackResponse = z.infer<
    typeof DeleteLocalTrackResponseSchema
>;
export type AddSongToPlaylistResponse = z.infer<
    typeof AddSongToPlaylistResponseSchema
>;
export type RemoveSongFromPlaylistResponse = z.infer<
    typeof RemoveSongFromPlaylistResponseSchema
>;
export type ReorderPlaylistsResponse = z.infer<
    typeof ReorderPlaylistsResponseSchema
>;
export type ReorderPlaylistTracksResponse = z.infer<
    typeof ReorderPlaylistTracksResponseSchema
>;
export type ReorderTracksResponse = z.infer<typeof ReorderTracksResponseSchema>;
export type ExportSongResponse = z.infer<typeof ExportSongResponseSchema>;
export type ExportLibraryResponse = z.infer<typeof ExportLibraryResponseSchema>;
export type ExportPlaylistResponse = z.infer<
    typeof ExportPlaylistResponseSchema
>;
