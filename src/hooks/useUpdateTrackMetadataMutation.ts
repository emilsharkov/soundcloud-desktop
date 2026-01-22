import { useTauriMutation } from '@/hooks/useTauriMutation';
import {
    UpdateLocalTrackResponse,
    UpdateLocalTrackResponseSchema,
} from '@/types/schemas';
import {
    UpdateLocalTrackQuery,
    UpdateLocalTrackQuerySchema,
} from '@/types/schemas/query';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseUpdateTrackMetadataMutationOptions {
    onSettled?: () => void;
}

export const useUpdateTrackMetadataMutation = (
    trackId: number,
    options: UseUpdateTrackMetadataMutationOptions = {}
) => {
    const queryClient = useQueryClient();
    const { onSettled } = options;

    const { mutate: updateTrack } = useTauriMutation<
        UpdateLocalTrackQuery,
        UpdateLocalTrackResponse
    >('update_local_track', {
        querySchema: UpdateLocalTrackQuerySchema,
        responseSchema: UpdateLocalTrackResponseSchema,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get_local_tracks'],
            });
            await queryClient.invalidateQueries({
                queryKey: ['get_local_track', trackId],
            });
            await queryClient.invalidateQueries({
                queryKey: ['get_song_image', trackId],
            });
            await queryClient.invalidateQueries({
                queryKey: ['get_track_media_metadata', trackId],
            });
            await queryClient.invalidateQueries({
                queryKey: ['get_playlist_songs_command'],
            });
            toast.success('Metadata updated successfully');
        },
        onError: () => {
            toast.error('Failed to update metadata');
        },
        onSettled: () => {
            onSettled?.();
        },
    });

    return {
        updateTrack,
    };
};
