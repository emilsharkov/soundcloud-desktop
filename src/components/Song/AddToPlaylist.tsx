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
import { useAddToPlaylistMutations } from '@/hooks/useAddToPlaylistMutations';
import { usePlaylists } from '@/hooks/usePlaylists';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AddToPlaylistProps {
    trackId: number;
}

const AddToPlaylist = (props: AddToPlaylistProps) => {
    const { trackId } = props;
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    const { data: playlists } = usePlaylists();

    const { addSongToPlaylist, createPlaylist } = useAddToPlaylistMutations({
        onCreateSuccess: () => {
            setCreateDialogOpen(false);
            setNewPlaylistName('');
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

    return (
        <>
            <DropdownMenuSub>
                <DropdownMenuSubTrigger
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    Add to playlist
                </DropdownMenuSubTrigger>
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
                        onClick={e => {
                            e.preventDefault();
                            setCreateDialogOpen(true);
                        }}
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
