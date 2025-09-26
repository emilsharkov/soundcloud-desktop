import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useTauriInvoke } from '@/hooks/useTauriInvoke';
import { PlaylistRow } from '@/models/response';
import { Music, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AddToPlaylistProps {
    trackId: string;
    trackTitle: string;
}

const AddToPlaylist = ({ trackId, trackTitle }: AddToPlaylistProps) => {
    const [playlists, setPlaylists] = useState<PlaylistRow[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { invoke } = useTauriInvoke();

    const loadPlaylists = async () => {
        try {
            const result = await invoke('get_playlists_command', {});
            setPlaylists(result);
        } catch (error) {
            console.error('Failed to load playlists:', error);
        }
    };

    const addToPlaylist = async (playlistId: string) => {
        setIsLoading(true);
        try {
            await invoke('add_song_to_playlist_command', {
                playlist_id: playlistId,
                track_id: trackId,
            });
            setIsDialogOpen(false);
            // You could add a toast notification here
        } catch (error) {
            console.error('Failed to add song to playlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isDialogOpen) {
            loadPlaylists();
        }
    }, [isDialogOpen]);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button size='sm' variant='outline'>
                    <Plus className='w-4 h-4 mr-2' />
                    Add to Playlist
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add "{trackTitle}" to Playlist</DialogTitle>
                </DialogHeader>
                <div className='space-y-2 max-h-64 overflow-y-auto'>
                    {playlists.length === 0 ? (
                        <div className='text-center py-4 text-gray-500'>
                            <Music className='w-8 h-8 mx-auto mb-2 opacity-50' />
                            <p>No playlists found</p>
                        </div>
                    ) : (
                        playlists.map(playlist => (
                            <div
                                key={playlist.id}
                                className='flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50'
                            >
                                <div className='flex-1'>
                                    <h3 className='font-medium'>
                                        {playlist.name}
                                    </h3>
                                    {playlist.description && (
                                        <p className='text-sm text-gray-600'>
                                            {playlist.description}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    size='sm'
                                    onClick={() => addToPlaylist(playlist.id)}
                                    disabled={isLoading}
                                >
                                    Add
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export { AddToPlaylist };
