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
    options: Omit<
        UseQueryOptions<V, Error, V, [string, ...unknown[]]>,
        'queryKey' | 'queryFn'
    > & {
        querySchema?: ZodType<TArgs>;
        responseSchema: ZodType<V>;
    }
): UseQueryResult<V, Error> => {
    const { querySchema, responseSchema, ...queryOptions } = options;

    return useQuery<V, Error, V, [string, ...unknown[]]>({
        ...queryOptions,
        queryKey: [command, ...Object.values(args ?? {})],
        queryFn: async () => {
            // Validate query arguments
            if (querySchema) {
                const argsResult = querySchema.safeParse(args);
                if (!argsResult.success) {
                    throw new Error(
                        `Query schema validation failed for command "${command}": ${argsResult.error.message}`
                    );
                }
            }

            const response = await invoke<V>(command, args as InvokeArgs);

            // Validate response (required)
            const responseResult = responseSchema.safeParse(response);
            if (!responseResult.success) {
                throw new Error(
                    `Response schema validation failed for command "${command}": ${responseResult.error.message}`
                );
            }
            return responseResult.data;
        },
    });
};
