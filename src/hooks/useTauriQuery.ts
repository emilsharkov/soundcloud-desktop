import {
    useQuery,
    type UseQueryOptions,
    type UseQueryResult,
} from '@tanstack/react-query';
import { invoke, type InvokeArgs } from '@tauri-apps/api/core';
import { type ZodType } from 'zod';

export const useTauriQuery = <TArgs extends object | undefined, V>(
    command: string,
    args: TArgs = undefined as TArgs,
    options?: Omit<
        UseQueryOptions<V, Error, V, [string, ...unknown[]]>,
        'queryKey' | 'queryFn'
    > & {
        schema?: ZodType<V>;
    }
): UseQueryResult<V, Error> => {
    const { schema, ...queryOptions } = options ?? {};

    return useQuery<V, Error, V, [string, ...unknown[]]>({
        ...queryOptions,
        queryKey: [command, ...Object.values(args ?? {})],
        queryFn: async () => {
            const response = await invoke<V>(command, args as InvokeArgs);
            if (schema) {
                return schema.parse(response);
            }
            return response;
        },
    });
};
