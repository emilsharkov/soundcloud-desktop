import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    GetLocalTracksResponse,
    GetLocalTracksResponseSchema,
    GetPlaylistSongsResponse,
    GetPlaylistSongsResponseSchema,
    PlaylistRow,
} from '@/types/schemas';
import {
    GetLocalTracksQuery,
    GetLocalTracksQuerySchema,
    GetPlaylistSongsQuery,
    GetPlaylistSongsQuerySchema,
} from '@/types/schemas/query';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { AddSongsDialog } from './AddSongsDialog';
import { usePlaylistMutations } from './hooks/usePlaylistMutations';
import { PlaylistDetailHeader } from './PlaylistDetailHeader';
import { PlaylistSong } from './PlaylistSong';

interface PlaylistDetailProps {
    playlist: PlaylistRow;
    onBack: () => void;
    onDelete: () => void;
}

const PlaylistDetail = (props: PlaylistDetailProps) => {
    const { playlist, onBack, onDelete } = props;
    const { id, name } = playlist;
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

    const { addSongToPlaylist, removeSong, reorderTracks } =
        usePlaylistMutations(id);

    const { sensors, restrictToVerticalAxis, handleDragEnd } = useDragAndDrop(
        songs,
        song => song.track_id,
        trackPositions => {
            reorderTracks({
                id,
                trackPositions,
            });
        }
    );

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
            <PlaylistDetailHeader
                name={name}
                onBack={onBack}
                onAddSongs={() => setAddSongsDialogOpen(true)}
                onDelete={onDelete}
            />
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

            <AddSongsDialog
                open={addSongsDialogOpen}
                onOpenChange={setAddSongsDialogOpen}
                libraryTracks={libraryTracks}
                playlistTrackIds={playlistTrackIds}
                onAddSong={handleAddSong}
            />
        </div>
    );
};

export { PlaylistDetail };
