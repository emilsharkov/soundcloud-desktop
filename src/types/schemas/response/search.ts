import { z } from 'zod';
import { PagingCollectionSchema } from '../utils';

// ===== Search =====
export const SearchResultSchema = z.object({
    output: z.string().nullable(),
    query: z.string().nullable(),
});

export const SearchResultsResponseSchema =
    PagingCollectionSchema(SearchResultSchema);

// ===== Search All =====
// Note: SearchAllResultSchema is defined in a separate file to avoid circular dependencies
// See response/all.ts for the full definition

// ===== Type exports =====
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type SearchResultsResponse = z.infer<typeof SearchResultsResponseSchema>;
