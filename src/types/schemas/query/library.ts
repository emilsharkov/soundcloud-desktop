import { z } from 'zod';

// ===== Library =====
export const GetLocalTracksQuerySchema = z.undefined();

export const GetLocalTrackQuerySchema = z.object({
    id: z.number(),
});

export const GetSongImageQuerySchema = z.object({
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

// ===== Type exports =====
export type GetLocalTracksQuery = z.infer<typeof GetLocalTracksQuerySchema>;
export type GetLocalTrackQuery = z.infer<typeof GetLocalTrackQuerySchema>;
export type GetSongImageQuery = z.infer<typeof GetSongImageQuerySchema>;
export type UpdateLocalTrackQuery = z.infer<typeof UpdateLocalTrackQuerySchema>;
export type DeleteLocalTrackQuery = z.infer<typeof DeleteLocalTrackQuerySchema>;
export type ReorderTracksQuery = z.infer<typeof ReorderTracksQuerySchema>;
