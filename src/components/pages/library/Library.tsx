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
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    Modifier,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
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

    const restrictToVerticalAxis: Modifier = ({ transform }) => {
        return {
            ...transform,
            x: 0,
        };
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px of movement before dragging starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || !tracks) return;

        const oldIndex = tracks.findIndex(t => t.id === Number(active.id));
        const newIndex = tracks.findIndex(t => t.id === Number(over.id));

        if (oldIndex !== newIndex) {
            const newTracks = arrayMove(tracks, oldIndex, newIndex);
            const trackPositions = newTracks.map(
                (track, index) => [track.id, index] as [number, number]
            );

            reorderTracks({ trackPositions });
        }
    };

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
