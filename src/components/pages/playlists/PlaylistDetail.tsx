import { SortableList } from '@/components/ui/sortable-list';
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

    const { addSongToPlaylist, reorderTracks } = usePlaylistMutations(id);

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
            <SortableList
                items={songs}
                getId={song => song.track_id}
                onReorder={trackPositions => {
                    reorderTracks({
                        id,
                        trackPositions,
                    });
                }}
                className='flex flex-col gap-4'
                emptyMessage='This playlist is empty'
            >
                {songs?.map(song => (
                    <PlaylistSong key={song.id} playlistSong={song} />
                ))}
            </SortableList>

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
