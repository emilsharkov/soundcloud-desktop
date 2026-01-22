import { useTauriMutation } from '@/hooks/useTauriMutation';
import {
    ExportLibraryResponse,
    ExportLibraryResponseSchema,
    ReorderTracksResponse,
    ReorderTracksResponseSchema,
} from '@/types/schemas';
import {
    ExportLibraryQuery,
    ExportLibraryQuerySchema,
    ReorderTracksQuery,
    ReorderTracksQuerySchema,
} from '@/types/schemas/query';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useLibraryMutations = () => {
    const queryClient = useQueryClient();

    const { mutate: reorderTracks } = useTauriMutation<
        ReorderTracksQuery,
        ReorderTracksResponse
    >('reorder_tracks_command', {
        querySchema: ReorderTracksQuerySchema,
        responseSchema: ReorderTracksResponseSchema,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get_local_tracks'],
            });
        },
        onError: error => {
            console.error('Failed to reorder tracks', error);
            toast.error('Failed to reorder tracks');
        },
    });

    const { mutate: exportLibrary, isPending: isExporting } = useTauriMutation<
        ExportLibraryQuery,
        ExportLibraryResponse
    >('export_library', {
        querySchema: ExportLibraryQuerySchema,
        responseSchema: ExportLibraryResponseSchema,
        onSuccess: () => {
            toast.success('Library exported successfully');
        },
        onError: error => {
            toast.error(`Failed to export library: ${error.message}`);
        },
    });

    return {
        exportLibrary,
        isExporting,
        reorderTracks,
    };
};
