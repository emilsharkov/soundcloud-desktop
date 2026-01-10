import {
    useInfiniteQuery,
    type UseInfiniteQueryOptions,
    type UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { invoke, type InvokeArgs } from '@tauri-apps/api/core';
import { type ZodType } from 'zod';

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
        schema?: ZodType<TResponse>;
    }
): UseInfiniteQueryResult<
    { pages: TResponse[]; pageParams: number[] },
    Error
> => {
    const { limit: optionsLimit, schema, ...queryOptions } = options ?? {};
    const limit = optionsLimit ?? 20;

    return useInfiniteQuery({
        ...queryOptions,
        queryKey: [command, ...Object.values(args ?? {})],
        queryFn: async ({ pageParam }) => {
            const paginatedArgs = {
                ...args,
                limit,
                offset: pageParam,
            } as InvokeArgs;
            const response = await invoke<TResponse>(command, paginatedArgs);
            if (schema) {
                return schema.parse(response);
            }
            return response;
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
