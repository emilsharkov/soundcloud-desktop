import { z } from 'zod';

// ===== Download =====
export const DownloadTrackQuerySchema = z.object({
    id: z.number(),
});

export const DownloadPlaylistQuerySchema = z.object({
    id: z.number(),
});

// ===== Type exports =====
export type DownloadTrackQuery = z.infer<typeof DownloadTrackQuerySchema>;
export type DownloadPlaylistQuery = z.infer<typeof DownloadPlaylistQuerySchema>;
