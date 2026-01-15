import { SortableList } from '@/components/ui/sortable-list';
import { usePlaylists } from '@/hooks/usePlaylists';
import { PlaylistRow } from '@/types/schemas';
import { useState } from 'react';
import { toast } from 'sonner';
import { CreatePlaylistDialog } from './CreatePlaylistDialog';
import { usePlaylistsMutations } from './hooks/usePlaylistsMutations';
import { PlaylistDetail } from './PlaylistDetail';
import { PlaylistItem } from './PlaylistItem';
import { PlaylistsHeader } from './PlaylistsHeader';

const Playlists = () => {
    const [selectedPlaylist, setSelectedPlaylist] =
        useState<PlaylistRow | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    const { data: playlists } = usePlaylists();

    const { createPlaylist, deletePlaylist, reorderPlaylists } =
        usePlaylistsMutations(
            () => {
                if (selectedPlaylist) {
                    setSelectedPlaylist(null);
                }
            },
            () => {
                setCreateDialogOpen(false);
                setNewPlaylistName('');
            }
        );

    const handleCreatePlaylist = () => {
        if (!newPlaylistName.trim()) {
            toast.error('Playlist name cannot be empty');
            return;
        }

        const position = playlists ? playlists.length : 0;
        createPlaylist({
            name: newPlaylistName.trim(),
            position,
        });
    };

    const handleDeletePlaylist = (playlist: PlaylistRow) => {
        deletePlaylist({ id: playlist.id });
    };

    const handleCancelCreate = () => {
        setCreateDialogOpen(false);
        setNewPlaylistName('');
    };

    if (selectedPlaylist) {
        return (
            <PlaylistDetail
                playlist={selectedPlaylist}
                onBack={() => setSelectedPlaylist(null)}
                onDelete={() => handleDeletePlaylist(selectedPlaylist)}
            />
        );
    }

    return (
        <div className='flex flex-col gap-4 p-4'>
            <PlaylistsHeader onCreateClick={() => setCreateDialogOpen(true)} />

            <SortableList
                items={playlists}
                getId={playlist => playlist.id}
                onReorder={positions => {
                    reorderPlaylists({ positions });
                }}
                emptyMessage='No playlists yet. Create one to get started!'
            >
                {playlists?.map(playlist => (
                    <PlaylistItem
                        key={playlist.id}
                        playlist={playlist}
                        onClick={() => setSelectedPlaylist(playlist)}
                    />
                ))}
            </SortableList>

            <CreatePlaylistDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                playlistName={newPlaylistName}
                onPlaylistNameChange={setNewPlaylistName}
                onCreate={handleCreatePlaylist}
                onCancel={handleCancelCreate}
            />
        </div>
    );
};

export { Playlists };
