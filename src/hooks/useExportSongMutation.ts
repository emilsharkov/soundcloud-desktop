import { useTauriMutation } from '@/hooks/useTauriMutation';
import { ExportSongQuery, ExportSongQuerySchema } from '@/types/schemas/query';
import {
    ExportSongResponse,
    ExportSongResponseSchema,
} from '@/types/schemas/response';
import { toast } from 'sonner';

export const useExportSongMutation = () => {
    const { mutate: exportSong, isPending } = useTauriMutation<
        ExportSongQuery,
        ExportSongResponse
    >('export_song', {
        querySchema: ExportSongQuerySchema,
        responseSchema: ExportSongResponseSchema,
        onSuccess: () => {
            toast.success('Song exported successfully');
        },
        onError: error => {
            toast.error(`Failed to export song: ${error.message}`);
        },
    });

    return {
        exportSong,
        isPending,
    };
};
