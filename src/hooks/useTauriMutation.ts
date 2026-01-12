import {
    useMutation,
    type UseMutationOptions,
    type UseMutationResult,
} from '@tanstack/react-query';
import { invoke, type InvokeArgs } from '@tauri-apps/api/core';
import { type ZodType } from 'zod';

export const useTauriMutation = <TArgs extends object | undefined, V>(
    command: string,
    options: Omit<UseMutationOptions<V, Error, TArgs>, 'mutationFn'> & {
        querySchema?: ZodType<TArgs>;
        responseSchema: ZodType<V>;
    }
): UseMutationResult<V, Error, TArgs> => {
    const { querySchema, responseSchema, ...mutationOptions } = options;

    return useMutation<V, Error, TArgs>({
        ...mutationOptions,
        networkMode: 'always', // Tauri commands are local IPC calls, not network requests, so they work offline
        mutationFn: async (args: TArgs) => {
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
