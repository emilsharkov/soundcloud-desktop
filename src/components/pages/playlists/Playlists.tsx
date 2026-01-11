import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    GetPlaylistsResponse,
    GetPlaylistsResponseSchema,
    PlaylistRow,
} from '@/types/schemas';
import {
    GetPlaylistsQuery,
    GetPlaylistsQuerySchema,
} from '@/types/schemas/query';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
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

    const { data: playlists } = useTauriQuery<
        GetPlaylistsQuery,
        GetPlaylistsResponse
    >('get_playlists_command', undefined, {
        querySchema: GetPlaylistsQuerySchema,
        responseSchema: GetPlaylistsResponseSchema,
    });

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

    const { sensors, restrictToVerticalAxis, handleDragEnd } = useDragAndDrop(
        playlists,
        playlist => playlist.id,
        positions => {
            reorderPlaylists({ positions });
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

            {playlists && playlists.length > 0 ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                >
                    <SortableContext
                        items={playlists.map(p => p.id.toString())}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className='flex flex-col gap-2'>
                            {playlists.map(playlist => (
                                <PlaylistItem
                                    key={playlist.id}
                                    playlist={playlist}
                                    onClick={() =>
                                        setSelectedPlaylist(playlist)
                                    }
                                    onDelete={() =>
                                        handleDeletePlaylist(playlist)
                                    }
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                <div className='flex flex-col items-center justify-center py-12 text-tertiary'>
                    <p>No playlists yet. Create one to get started!</p>
                </div>
            )}

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
