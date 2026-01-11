import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useTauriMutation } from '@/hooks/useTauriMutation';
import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    AddSongToPlaylistResponse,
    AddSongToPlaylistResponseSchema,
    GetLocalTracksResponse,
    GetLocalTracksResponseSchema,
    GetPlaylistSongsResponse,
    GetPlaylistSongsResponseSchema,
    PlaylistRow,
    RemoveSongFromPlaylistResponse,
    RemoveSongFromPlaylistResponseSchema,
    ReorderPlaylistTracksResponse,
    ReorderPlaylistTracksResponseSchema,
} from '@/types/schemas';
import {
    AddSongToPlaylistQuery,
    AddSongToPlaylistQuerySchema,
    GetLocalTracksQuery,
    GetLocalTracksQuerySchema,
    GetPlaylistSongsQuery,
    GetPlaylistSongsQuerySchema,
    RemoveSongFromPlaylistQuery,
    RemoveSongFromPlaylistQuerySchema,
    ReorderPlaylistTracksQuery,
    ReorderPlaylistTracksQuerySchema,
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
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { PlaylistSong } from './PlaylistSong';

interface PlaylistDetailProps {
    playlist: PlaylistRow;
    onBack: () => void;
    onDelete: () => void;
}

const PlaylistDetail = (props: PlaylistDetailProps) => {
    const { playlist, onBack, onDelete } = props;
    const { id, name } = playlist;
    const queryClient = useQueryClient();
    const [addSongsDialogOpen, setAddSongsDialogOpen] = useState(false);

    const { data: songs } = useTauriQuery<
        GetPlaylistSongsQuery,
        GetPlaylistSongsResponse
    >(
        'get_playlist_songs_command',
        { id },
        {
            querySchema: GetPlaylistSongsQuerySchema,
            responseSchema: GetPlaylistSongsResponseSchema,
        }
    );

    const { data: libraryTracks } = useTauriQuery<
        GetLocalTracksQuery,
        GetLocalTracksResponse
    >('get_local_tracks', undefined, {
        querySchema: GetLocalTracksQuerySchema,
        responseSchema: GetLocalTracksResponseSchema,
        enabled: addSongsDialogOpen,
    });

    const { mutate: addSongToPlaylist } = useTauriMutation<
        AddSongToPlaylistQuery,
        AddSongToPlaylistResponse
    >('add_song_to_playlist_command', {
        querySchema: AddSongToPlaylistQuerySchema,
        responseSchema: AddSongToPlaylistResponseSchema,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get_playlist_songs_command', id],
            });
            toast.success('Added to playlist');
        },
        onError: error => {
            console.error('Failed to add song to playlist', error);
            toast.error('Failed to add to playlist');
        },
    });

    const { mutate: removeSong } = useTauriMutation<
        RemoveSongFromPlaylistQuery,
        RemoveSongFromPlaylistResponse
    >('remove_song_from_playlist_command', {
        querySchema: RemoveSongFromPlaylistQuerySchema,
        responseSchema: RemoveSongFromPlaylistResponseSchema,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get_playlist_songs_command', id],
            });
        },
    });

    const { mutate: reorderTracks } = useTauriMutation<
        ReorderPlaylistTracksQuery,
        ReorderPlaylistTracksResponse
    >('reorder_playlist_tracks_command', {
        querySchema: ReorderPlaylistTracksQuerySchema,
        responseSchema: ReorderPlaylistTracksResponseSchema,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get_playlist_songs_command', id],
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

        if (!over || !songs) return;

        const oldIndex = songs.findIndex(s => s.track_id === Number(active.id));
        const newIndex = songs.findIndex(s => s.track_id === Number(over.id));

        if (oldIndex !== newIndex) {
            const newSongs = arrayMove(songs, oldIndex, newIndex);
            const trackPositions = newSongs.map(
                (song, index) => [song.track_id, index] as [number, number]
            );

            reorderTracks({
                id,
                trackPositions,
            });
        }
    };

    const handleRemoveSong = (trackId: number) => {
        removeSong({
            playlistId: id,
            trackId: trackId,
        });
    };

    const handleAddSong = (trackId: number) => {
        addSongToPlaylist({
            playlistId: id,
            trackId: trackId,
        });
    };

    // Get track IDs already in the playlist
    const playlistTrackIds = new Set(songs?.map(s => s.track_id) ?? []);

    return (
        <div className='flex flex-col gap-4 p-4'>
            <div className='flex flex-row items-center gap-4'>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={onBack}
                    className='shrink-0'
                >
                    <ArrowLeft className='w-5 h-5' />
                </Button>
                <h1 className='text-2xl font-semibold text-secondary flex-1'>
                    {name}
                </h1>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setAddSongsDialogOpen(true)}
                    className='shrink-0'
                >
                    <Plus className='w-4 h-4 mr-2' />
                    Add Songs
                </Button>
                <Button
                    variant='destructive'
                    size='sm'
                    onClick={onDelete}
                    className='shrink-0'
                >
                    <Trash2 className='w-4 h-4 mr-2' />
                    Delete Playlist
                </Button>
            </div>
            {songs && songs.length > 0 ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                >
                    <SortableContext
                        items={songs.map(s => s.track_id.toString())}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className='flex flex-col gap-4'>
                            {songs.map(song => (
                                <PlaylistSong
                                    key={song.id}
                                    playlistSong={song}
                                    onRemove={() =>
                                        handleRemoveSong(song.track_id)
                                    }
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                <div className='flex flex-col items-center justify-center py-12 text-tertiary'>
                    <p>This playlist is empty</p>
                </div>
            )}

            <Dialog
                open={addSongsDialogOpen}
                onOpenChange={setAddSongsDialogOpen}
            >
                <DialogContent className='max-w-2xl max-h-[80vh]'>
                    <DialogHeader>
                        <DialogTitle>Add Songs to Playlist</DialogTitle>
                        <DialogDescription>
                            Select songs from your library to add to this
                            playlist.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col gap-2 max-h-[60vh] overflow-y-auto py-4'>
                        {libraryTracks && libraryTracks.length > 0 ? (
                            libraryTracks
                                .filter(
                                    track => !playlistTrackIds.has(track.id)
                                )
                                .map(track => (
                                    <button
                                        key={track.id}
                                        className='flex flex-row items-center gap-3 p-3 rounded-lg hover:bg-accent text-left'
                                        onClick={() => {
                                            handleAddSong(track.id);
                                        }}
                                    >
                                        <div className='flex flex-col flex-1 min-w-0'>
                                            <p className='text-secondary font-medium truncate'>
                                                {track.title}
                                            </p>
                                            <p className='text-tertiary text-sm truncate'>
                                                {track.artist}
                                            </p>
                                        </div>
                                        <Plus className='w-5 h-5 text-tertiary shrink-0' />
                                    </button>
                                ))
                        ) : (
                            <p className='text-tertiary text-center py-8'>
                                No songs available to add
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() => setAddSongsDialogOpen(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export { PlaylistDetail };
