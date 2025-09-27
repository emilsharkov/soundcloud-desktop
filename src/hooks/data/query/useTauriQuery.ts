import {
    useQuery,
    type UseQueryOptions,
    type UseQueryResult,
} from '@tanstack/react-query';
import { invoke, type InvokeArgs } from '@tauri-apps/api/core';

export const useTauriQuery = <TArgs extends object, V>(
    command: string,
    args: TArgs = {} as TArgs,
    options?: Omit<
        UseQueryOptions<V, Error, V, [string, ...unknown[]]>,
        'queryKey' | 'queryFn'
    >
): UseQueryResult<V, Error> => {
    return useQuery<V, Error, V, [string, ...unknown[]]>({
        ...options,
        queryKey: [command, ...Object.values(args)],
        queryFn: async () => await invoke<V>(command, args as InvokeArgs),
    });
};
