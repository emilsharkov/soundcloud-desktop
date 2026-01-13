import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useTauriMutation } from '@/hooks/useTauriMutation';
import { Track, TrackSchema } from '@/types/schemas';
import {
    DeleteLocalTrackQuery,
    DeleteLocalTrackQuerySchema,
} from '@/types/schemas/query';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSettingsContext } from './Settings';

const SettingsDelete = () => {
    const { trackId } = useSettingsContext();
    const queryClient = useQueryClient();

    const { mutate: deleteTrack } = useTauriMutation<
        DeleteLocalTrackQuery,
        Track
    >('delete_local_track', {
        querySchema: DeleteLocalTrackQuerySchema,
        responseSchema: TrackSchema,
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
            toast.success('Track deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete track');
        },
    });

    const handleDelete = () => {
        deleteTrack({ id: trackId });
    };

    return <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>;
};

export { SettingsDelete };
