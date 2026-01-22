import { z } from 'zod';

// ===== Download =====
export const DownloadTrackQuerySchema = z.object({
    id: z.number(),
});

export const DownloadPlaylistQuerySchema = z.object({
    id: z.number(),
});

export const ImportTracksQuerySchema = z.object({
    ids: z.array(z.number()),
});

// ===== Type exports =====
export type DownloadTrackQuery = z.infer<typeof DownloadTrackQuerySchema>;
export type DownloadPlaylistQuery = z.infer<typeof DownloadPlaylistQuerySchema>;
export type ImportTracksQuery = z.infer<typeof ImportTracksQuerySchema>;
