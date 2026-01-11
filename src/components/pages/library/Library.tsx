import { useDragAndDrop } from '@/hooks/useDragAndDrop';
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
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
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

    const { sensors, restrictToVerticalAxis, handleDragEnd } = useDragAndDrop(
        tracks,
        track => track.id,
        trackPositions => {
            reorderTracks({ trackPositions });
        }
    );

    return (
        <div className='flex flex-col gap-4 p-4'>
            {tracks && tracks.length > 0 ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                >
                    <SortableContext
                        items={tracks.map(t => t.id.toString())}
                        strategy={verticalListSortingStrategy}
                    >
                        {tracks.map((trackRow: TrackRow) => (
                            <LibrarySong
                                key={trackRow.id}
                                trackRow={trackRow}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            ) : (
                <div className='flex flex-col items-center justify-center py-12 text-tertiary'>
                    <p>No tracks in library</p>
                </div>
            )}
        </div>
    );
};

export { Library };
