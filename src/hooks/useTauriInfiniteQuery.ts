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
    options: Omit<
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
        querySchema?: ZodType<TArgs>;
        responseSchema: ZodType<TResponse>;
    }
): UseInfiniteQueryResult<
    { pages: TResponse[]; pageParams: number[] },
    Error
> => {
    const {
        limit: optionsLimit,
        querySchema,
        responseSchema,
        ...queryOptions
    } = options;
    const limit = optionsLimit ?? 20;

    return useInfiniteQuery({
        ...queryOptions,
        queryKey: [command, ...Object.values(args ?? {})],
        queryFn: async ({ pageParam }) => {
            const paginatedArgs = {
                ...args,
                limit,
                offset: pageParam,
            } as TArgs;

            // Validate query arguments
            if (querySchema) {
                const argsResult = querySchema.safeParse(paginatedArgs);
                if (!argsResult.success) {
                    throw new Error(
                        `Query schema validation failed for command "${command}": ${argsResult.error.message}`
                    );
                }
            }

            const response = await invoke<TResponse>(
                command,
                paginatedArgs as InvokeArgs
            );

            // Validate response (required)
            const responseResult = responseSchema.safeParse(response);
            if (!responseResult.success) {
                throw new Error(
                    `Response schema validation failed for command "${command}": ${responseResult.error.message}`
                );
            }
            return responseResult.data;
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
