import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    SearchResultsResponse,
    SearchResultsResponseSchema,
} from '@/types/schemas';
import {
    SearchResultsQuery,
    SearchResultsQuerySchema,
} from '@/types/schemas/query';

interface UseSearchResultsOptions {
    enabled?: boolean;
}

const useSearchResults = (query: string, options?: UseSearchResultsOptions) => {
    const shouldEnable = options?.enabled ?? query.trim() !== '';
    return useTauriQuery<SearchResultsQuery, SearchResultsResponse>(
        'search_results',
        { q: query },
        {
            querySchema: SearchResultsQuerySchema,
            responseSchema: SearchResultsResponseSchema,
            enabled: shouldEnable,
        }
    );
};

export { useSearchResults };
