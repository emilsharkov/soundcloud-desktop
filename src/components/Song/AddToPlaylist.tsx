import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useTauriMutation } from '@/hooks/useTauriMutation';
import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    AddSongToPlaylistResponse,
    AddSongToPlaylistResponseSchema,
    CreatePlaylistResponse,
    CreatePlaylistResponseSchema,
    GetPlaylistsResponse,
    GetPlaylistsResponseSchema,
} from '@/types/schemas';
import {
    AddSongToPlaylistQuery,
    AddSongToPlaylistQuerySchema,
    CreatePlaylistQuery,
    CreatePlaylistQuerySchema,
    GetPlaylistsQuery,
    GetPlaylistsQuerySchema,
} from '@/types/schemas/query';
import { useQueryClient } from '@tanstack/react-query';
import { Music, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AddToPlaylistProps {
    trackId: number;
    variant?: 'menu' | 'button';
}

const AddToPlaylist = (props: AddToPlaylistProps) => {
    const { trackId, variant = 'menu' } = props;
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

    const { mutate: addSongToPlaylist } = useTauriMutation<
        AddSongToPlaylistQuery,
        AddSongToPlaylistResponse
    >('add_song_to_playlist_command', {
        querySchema: AddSongToPlaylistQuerySchema,
        responseSchema: AddSongToPlaylistResponseSchema,
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ['get_playlist_songs_command', variables.playlistId],
            });
            toast.success('Added to playlist');
        },
        onError: error => {
            console.error('Failed to add song to playlist', error);
            toast.error('Failed to add to playlist');
        },
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

    const handleAddToPlaylist = (playlistId: number) => {
        addSongToPlaylist({
            playlistId: playlistId,
            trackId: trackId,
        });
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

    if (variant === 'button') {
        return (
            <>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setCreateDialogOpen(true)}
                >
                    <Plus className='w-4 h-4 mr-2' />
                    Add to Playlist
                </Button>
                <Dialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add to Playlist</DialogTitle>
                            <DialogDescription>
                                Select a playlist or create a new one.
                            </DialogDescription>
                        </DialogHeader>
                        <div className='flex flex-col gap-4 py-4'>
                            {playlists && playlists.length > 0 && (
                                <div className='flex flex-col gap-2 max-h-60 overflow-y-auto'>
                                    {playlists.map(playlist => (
                                        <button
                                            key={playlist.id}
                                            className='flex flex-row items-center gap-3 p-2 rounded-lg hover:bg-accent text-left'
                                            onClick={() => {
                                                handleAddToPlaylist(
                                                    playlist.id
                                                );
                                                setCreateDialogOpen(false);
                                            }}
                                        >
                                            <Music className='w-5 h-5 text-tertiary' />
                                            <span className='text-secondary'>
                                                {playlist.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className='flex flex-col gap-2'>
                                <Input
                                    placeholder='New playlist name'
                                    value={newPlaylistName}
                                    onChange={e =>
                                        setNewPlaylistName(e.target.value)
                                    }
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            handleCreatePlaylist();
                                        }
                                    }}
                                />
                                <Button
                                    onClick={handleCreatePlaylist}
                                    size='sm'
                                >
                                    Create and Add
                                </Button>
                            </div>
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
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>
        );
    }

    return (
        <>
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>Add to playlist</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    {playlists && playlists.length > 0 ? (
                        playlists.map(playlist => (
                            <DropdownMenuItem
                                key={playlist.id}
                                onClick={() => handleAddToPlaylist(playlist.id)}
                            >
                                {playlist.name}
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuItem disabled>
                            No playlists yet
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                        onClick={() => setCreateDialogOpen(true)}
                        className='text-primary'
                    >
                        <Plus className='w-4 h-4 mr-2' />
                        Create new playlist
                    </DropdownMenuItem>
                </DropdownMenuSubContent>
            </DropdownMenuSub>
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
        </>
    );
};

export { AddToPlaylist };
