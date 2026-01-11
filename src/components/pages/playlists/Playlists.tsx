import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTauriMutation } from '@/hooks/useTauriMutation';
import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    CreatePlaylistResponse,
    CreatePlaylistResponseSchema,
    DeletePlaylistResponse,
    DeletePlaylistResponseSchema,
    GetPlaylistsResponse,
    GetPlaylistsResponseSchema,
    PlaylistRow,
    ReorderPlaylistsResponse,
    ReorderPlaylistsResponseSchema,
} from '@/types/schemas';
import {
    CreatePlaylistQuery,
    CreatePlaylistQuerySchema,
    DeletePlaylistQuery,
    DeletePlaylistQuerySchema,
    GetPlaylistsQuery,
    GetPlaylistsQuerySchema,
    ReorderPlaylistsQuery,
    ReorderPlaylistsQuerySchema,
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
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { PlaylistDetail } from './PlaylistDetail';
import { PlaylistItem } from './PlaylistItem';

const Playlists = () => {
    const [selectedPlaylist, setSelectedPlaylist] =
        useState<PlaylistRow | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const queryClient = useQueryClient();

    const { data: playlists } = useTauriQuery<
        GetPlaylistsQuery,
        GetPlaylistsResponse
    >('get_playlists_command', undefined, {
        querySchema: GetPlaylistsQuerySchema,
        responseSchema: GetPlaylistsResponseSchema,
    });

    const { mutate: createPlaylist } = useTauriMutation<
        CreatePlaylistQuery,
        CreatePlaylistResponse
    >('create_playlist_command', {
        querySchema: CreatePlaylistQuerySchema,
        responseSchema: CreatePlaylistResponseSchema,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get_playlists_command'],
            });
            setCreateDialogOpen(false);
            setNewPlaylistName('');
            toast.success('Playlist created successfully');
        },
        onError: error => {
            console.error('Failed to create playlist', error);
            toast.error('Failed to create playlist');
        },
    });

    const { mutate: deletePlaylist } = useTauriMutation<
        DeletePlaylistQuery,
        DeletePlaylistResponse
    >('delete_playlist_command', {
        querySchema: DeletePlaylistQuerySchema,
        responseSchema: DeletePlaylistResponseSchema,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get_playlists_command'],
            });
            if (selectedPlaylist) {
                setSelectedPlaylist(null);
            }
            toast.success('Playlist deleted successfully');
        },
        onError: error => {
            console.error('Failed to delete playlist', error);
            toast.error('Failed to delete playlist');
        },
    });

    const { mutate: reorderPlaylists } = useTauriMutation<
        ReorderPlaylistsQuery,
        ReorderPlaylistsResponse
    >('reorder_playlists_command', {
        querySchema: ReorderPlaylistsQuerySchema,
        responseSchema: ReorderPlaylistsResponseSchema,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get_playlists_command'],
            });
        },
        onError: error => {
            console.error('Failed to reorder playlists', error);
            toast.error('Failed to reorder playlists');
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

        if (!over || !playlists) return;

        const oldIndex = playlists.findIndex(p => p.id === Number(active.id));
        const newIndex = playlists.findIndex(p => p.id === Number(over.id));

        if (oldIndex !== newIndex) {
            const newPlaylists = arrayMove(playlists, oldIndex, newIndex);
            const positions = newPlaylists.map(
                (playlist, index) => [playlist.id, index] as [number, number]
            );

            reorderPlaylists({ positions });
        }
    };

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
            <div className='flex flex-row items-center justify-between'>
                <h1 className='text-2xl font-semibold text-secondary'>
                    Playlists
                </h1>
                <Button
                    onClick={() => setCreateDialogOpen(true)}
                    className='shrink-0'
                >
                    <Plus className='w-4 h-4 mr-2' />
                    New Playlist
                </Button>
            </div>

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

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Playlist</DialogTitle>
                        <DialogDescription>
                            Enter a name for your new playlist.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col gap-4 py-4'>
                        <Input
                            placeholder='Playlist name'
                            value={newPlaylistName}
                            onChange={e => setNewPlaylistName(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    handleCreatePlaylist();
                                }
                            }}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() => {
                                setCreateDialogOpen(false);
                                setNewPlaylistName('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCreatePlaylist}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export { Playlists };
