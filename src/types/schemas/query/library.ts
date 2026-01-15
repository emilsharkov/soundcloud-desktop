import { z } from 'zod';

// ===== Library =====
export const GetLocalTracksQuerySchema = z.undefined();

export const GetLocalTrackQuerySchema = z.object({
    id: z.number(),
});

export const GetSongImageQuerySchema = z.object({
    id: z.number(),
});

export const GetTrackQuerySchema = z.object({
    id: z.number(),
});

export const UpdateLocalTrackQuerySchema = z.object({
    id: z.number(),
    title: z.string().optional(),
    artist: z.string().optional(),
    artwork: z.string().optional(),
});

export const DeleteLocalTrackQuerySchema = z.object({
    id: z.number(),
});

export const ReorderTracksQuerySchema = z.object({
    trackPositions: z.array(z.tuple([z.number(), z.number()])), // [(trackId, position), ...]
});

export const ExportSongQuerySchema = z.object({
    id: z.number(),
    folderPath: z.string(),
});

export const ExportLibraryQuerySchema = z.object({
    folderPath: z.string(),
});

export const ExportPlaylistQuerySchema = z.object({
    playlistId: z.number(),
    folderPath: z.string(),
});

// ===== Media - Track =====
export const GetTrackMediaMetadataQuerySchema = z.object({
    id: z.number(),
});

// ===== Type exports =====
export type GetLocalTracksQuery = z.infer<typeof GetLocalTracksQuerySchema>;
export type GetLocalTrackQuery = z.infer<typeof GetLocalTrackQuerySchema>;
export type GetSongImageQuery = z.infer<typeof GetSongImageQuerySchema>;
export type GetTrackQuery = z.infer<typeof GetTrackQuerySchema>;
export type UpdateLocalTrackQuery = z.infer<typeof UpdateLocalTrackQuerySchema>;
export type DeleteLocalTrackQuery = z.infer<typeof DeleteLocalTrackQuerySchema>;
export type ReorderTracksQuery = z.infer<typeof ReorderTracksQuerySchema>;
export type ExportSongQuery = z.infer<typeof ExportSongQuerySchema>;
export type ExportLibraryQuery = z.infer<typeof ExportLibraryQuerySchema>;
export type ExportPlaylistQuery = z.infer<typeof ExportPlaylistQuerySchema>;
export type GetTrackMediaMetadataQuery = z.infer<
    typeof GetTrackMediaMetadataQuerySchema
>;
