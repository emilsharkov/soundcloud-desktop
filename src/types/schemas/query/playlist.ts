import { z } from 'zod';

// ===== Media - Playlist =====
export const GetPlaylistsQuerySchema = z.undefined();

export const GetPlaylistQuerySchema = z.object({
    id: z.number(),
});

export const GetPlaylistSongsQuerySchema = z.object({
    id: z.number(),
});

export const CreatePlaylistQuerySchema = z.object({
    name: z.string(),
    position: z.number(),
});

export const UpdatePlaylistQuerySchema = z.object({
    id: z.number(),
    name: z.string(),
    position: z.number(),
});

export const DeletePlaylistQuerySchema = z.object({
    id: z.number(),
});

export const AddSongToPlaylistQuerySchema = z.object({
    playlist_id: z.number(),
    track_id: z.number(),
});

export const RemoveSongFromPlaylistQuerySchema = z.object({
    playlist_id: z.number(),
    track_id: z.number(),
});

// ===== Type exports =====
export type GetPlaylistsQuery = z.infer<typeof GetPlaylistsQuerySchema>;
export type GetPlaylistQuery = z.infer<typeof GetPlaylistQuerySchema>;
export type GetPlaylistSongsQuery = z.infer<typeof GetPlaylistSongsQuerySchema>;
export type CreatePlaylistQuery = z.infer<typeof CreatePlaylistQuerySchema>;
export type UpdatePlaylistQuery = z.infer<typeof UpdatePlaylistQuerySchema>;
export type DeletePlaylistQuery = z.infer<typeof DeletePlaylistQuerySchema>;
export type AddSongToPlaylistQuery = z.infer<
    typeof AddSongToPlaylistQuerySchema
>;
export type RemoveSongFromPlaylistQuery = z.infer<
    typeof RemoveSongFromPlaylistQuerySchema
>;
