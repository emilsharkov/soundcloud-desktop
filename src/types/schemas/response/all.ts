import { z } from 'zod';
import { PagingCollectionSchema } from '../utils';
import { PlaylistSchema } from './playlists';
import { TrackSchema } from './tracks';
import { UserSchema } from './users';

// ===== Search All =====
export const SearchAllResultSchema = z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('track'), Track: TrackSchema }),
    z.object({ kind: z.literal('user'), User: UserSchema }),
    z.object({ kind: z.literal('playlist'), Playlist: PlaylistSchema }),
]);

export const SearchAllResponseSchema = PagingCollectionSchema(
    SearchAllResultSchema
);

// ===== Type exports =====
export type SearchAllResult = z.infer<typeof SearchAllResultSchema>;
export type SearchAllResponse = z.infer<typeof SearchAllResponseSchema>;
