import { useTauriMutation } from '@/hooks/useTauriMutation';
import {
    ExportPlaylistQuery,
    ExportPlaylistQuerySchema,
} from '@/types/schemas/query';
import {
    ExportPlaylistResponse,
    ExportPlaylistResponseSchema,
} from '@/types/schemas/response';
import { toast } from 'sonner';

export const useExportPlaylistMutation = () => {
    const { mutate: exportPlaylist, isPending: isExporting } = useTauriMutation<
        ExportPlaylistQuery,
        ExportPlaylistResponse
    >('export_playlist', {
        querySchema: ExportPlaylistQuerySchema,
        responseSchema: ExportPlaylistResponseSchema,
        onSuccess: () => {
            toast.success('Playlist exported successfully');
        },
        onError: error => {
            toast.error(`Failed to export playlist: ${error.message}`);
        },
    });

    return {
        exportPlaylist,
        isExporting,
    };
};
