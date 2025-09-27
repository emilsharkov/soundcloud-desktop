import {
    useMutation,
    type UseMutationOptions,
    type UseMutationResult,
} from '@tanstack/react-query';
import { invoke, type InvokeArgs } from '@tauri-apps/api/core';

export const useTauriMutation = <TArgs extends object, V>(
    command: string,
    options?: Omit<UseMutationOptions<V, Error, TArgs>, 'mutationFn'>
): UseMutationResult<V, Error, TArgs> => {
    return useMutation<V, Error, TArgs>({
        ...options,
        mutationFn: async (args: TArgs) => {
            return await invoke<V>(command, args as InvokeArgs);
        },
    });
};
