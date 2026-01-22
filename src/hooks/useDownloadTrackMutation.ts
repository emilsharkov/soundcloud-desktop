import { useTauriMutation } from '@/hooks/useTauriMutation';
import {
    DownloadTrackResponse,
    DownloadTrackResponseSchema,
} from '@/types/schemas';
import {
    DownloadTrackQuery,
    DownloadTrackQuerySchema,
} from '@/types/schemas/query';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseDownloadTrackMutationOptions {
    onSettled?: () => void;
}

export const useDownloadTrackMutation = (
    trackId: number,
    options: UseDownloadTrackMutationOptions = {}
) => {
    const queryClient = useQueryClient();
    const { onSettled } = options;

    const { mutate: downloadTrack } = useTauriMutation<
        DownloadTrackQuery,
        DownloadTrackResponse
    >('download_track', {
        querySchema: DownloadTrackQuerySchema,
        responseSchema: DownloadTrackResponseSchema,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get_local_tracks'],
            });
            await queryClient.invalidateQueries({
                queryKey: ['get_local_track', trackId],
            });
            toast.success('Downloaded successfully');
        },
        onError: error => {
            console.error('Failed to download', error);
            toast.error('Failed to download');
        },
        onSettled: () => {
            onSettled?.();
        },
    });

    return {
        downloadTrack,
    };
};
