import {
    useInfiniteQuery,
    type UseInfiniteQueryOptions,
    type UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { invoke, type InvokeArgs } from '@tauri-apps/api/core';

export interface PaginatedArgs {
    limit?: number;
    offset?: number;
}

export interface PaginatedResponse<T> {
    collection: T[];
}

export const useTauriInfiniteQuery = <
    TArgs extends PaginatedArgs,
    TItem,
    TResponse extends PaginatedResponse<TItem> = PaginatedResponse<TItem>,
>(
    command: string,
    args: Omit<TArgs, 'offset'>,
    options?: Omit<
        UseInfiniteQueryOptions<
            TResponse,
            Error,
            { pages: TResponse[]; pageParams: number[] },
            [string, ...unknown[]],
            number
        >,
        'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
    > & {
        limit?: number;
    }
): UseInfiniteQueryResult<
    { pages: TResponse[]; pageParams: number[] },
    Error
> => {
    const limit = options?.limit ?? 20;

    return useInfiniteQuery({
        ...options,
        queryKey: [command, ...Object.values(args ?? {})],
        queryFn: async ({ pageParam }) => {
            const paginatedArgs = {
                ...args,
                limit,
                offset: pageParam,
            } as InvokeArgs;
            return await invoke<TResponse>(command, paginatedArgs);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            // If the last page has fewer items than the limit, we've reached the end
            if (lastPage.collection.length < limit) {
                return undefined;
            }
            // Calculate the next offset based on all items fetched so far
            const totalItems = allPages.reduce(
                (sum, page) => sum + page.collection.length,
                0
            );
            return totalItems;
        },
    });
};
