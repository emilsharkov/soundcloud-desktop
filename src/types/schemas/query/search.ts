import { z } from 'zod';

// ===== Search =====
export const SearchResultsQuerySchema = z.object({
    q: z.string(),
    limit: z.number().optional(),
    offset: z.number().optional(),
});

export const SearchTracksQuerySchema = z.object({
    q: z.string(),
    limit: z.number().optional(),
    offset: z.number().optional(),
});

export const SearchPlaylistsQuerySchema = z.object({
    q: z.string(),
    limit: z.number().optional(),
    offset: z.number().optional(),
});

// ===== Type exports =====
export type SearchResultsQuery = z.infer<typeof SearchResultsQuerySchema>;
export type SearchTracksQuery = z.infer<typeof SearchTracksQuerySchema>;
export type SearchPlaylistsQuery = z.infer<typeof SearchPlaylistsQuerySchema>;
