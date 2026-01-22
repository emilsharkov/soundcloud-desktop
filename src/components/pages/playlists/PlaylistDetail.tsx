import { SearchInput } from '@/components/ui/search-input';
import { SortableList } from '@/components/ui/sortable-list';
import { useLocalTracks } from '@/hooks/useLocalTracks';
import { usePlaylistSongs } from '@/hooks/usePlaylistSongs';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { PlaylistRow } from '@/types/schemas';
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

    const { data: songs } = usePlaylistSongs(id);

    const { data: libraryTracks } = useLocalTracks({
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

    const { query, setQuery, normalizedQuery, filteredItems } = useSearchFilter(
        {
            items: songs,
            getSearchText: song => `${song.title ?? ''} ${song.artist ?? ''}`,
        }
    );

    return (
        <div className='flex flex-col gap-4 p-4'>
            <PlaylistDetailHeader
                playlistId={id}
                name={name}
                onBack={onBack}
                onAddSongs={() => setAddSongsDialogOpen(true)}
                onDelete={onDelete}
            />
            <SearchInput
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder='Search playlist songs'
                aria-label='Search playlist songs'
            />
            {normalizedQuery ? (
                filteredItems.length > 0 ? (
                    <div className='flex flex-col gap-4'>
                        {filteredItems.map(song => {
                            const queueContext = {
                                tab: 'playlists' as const,
                                trackIds: filteredItems.map(s => s.track_id),
                            };
                            return (
                                <PlaylistSong
                                    key={song.id}
                                    playlistSong={song}
                                    queueContext={queueContext}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center py-12 text-tertiary'>
                        <p>No matching songs</p>
                    </div>
                )
            ) : (
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
                    {songs?.map(song => {
                        const queueContext = {
                            tab: 'playlists' as const,
                            trackIds: songs.map(s => s.track_id),
                        };
                        return (
                            <PlaylistSong
                                key={song.id}
                                playlistSong={song}
                                queueContext={queueContext}
                            />
                        );
                    })}
                </SortableList>
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
