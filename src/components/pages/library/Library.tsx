import { SortableList } from '@/components/ui/sortable-list';
import { useTauriMutation } from '@/hooks/useTauriMutation';
import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    GetLocalTracksResponseSchema,
    ReorderTracksResponse,
    ReorderTracksResponseSchema,
    TrackRow,
} from '@/types/schemas';
import {
    GetLocalTracksQuerySchema,
    ReorderTracksQuery,
    ReorderTracksQuerySchema,
} from '@/types/schemas/query';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LibrarySong } from './LibrarySong';

const Library = () => {
    const queryClient = useQueryClient();

    const { data: tracks } = useTauriQuery<undefined, TrackRow[]>(
        'get_local_tracks',
        undefined,
        {
            querySchema: GetLocalTracksQuerySchema,
            responseSchema: GetLocalTracksResponseSchema,
        }
    );

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

    return (
        <div className='flex flex-col gap-4 p-4'>
            <SortableList
                items={tracks}
                getId={track => track.id}
                onReorder={trackPositions => {
                    reorderTracks({ trackPositions });
                }}
                emptyMessage='No tracks in library'
            >
                {tracks?.map((trackRow: TrackRow) => (
                    <LibrarySong key={trackRow.id} trackRow={trackRow} />
                ))}
            </SortableList>
        </div>
    );
};

export { Library };
