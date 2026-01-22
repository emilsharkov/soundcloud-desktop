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
import { useSongImage } from '@/hooks/useSongImage';
import { TrackRow } from '@/types/schemas';
import { Music, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

interface AddSongsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    libraryTracks: TrackRow[] | undefined;
    playlistTrackIds: Set<number>;
    onAddSong: (trackId: number) => void;
}

const TrackItem = (props: { track: TrackRow; onAdd: () => void }) => {
    const { track, onAdd } = props;

    const { data: artwork } = useSongImage(track.id);

    return (
        <button
            className='flex flex-row items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors group text-left w-full'
            onClick={onAdd}
        >
            <div className='size-12 min-w-12 min-h-12 rounded-lg overflow-hidden bg-accent flex items-center justify-center shrink-0'>
                {artwork ? (
                    <img
                        src={artwork}
                        alt={`${track.title} artwork`}
                        className='w-full h-full object-cover'
                    />
                ) : (
                    <Music className='w-6 h-6 text-tertiary' />
                )}
            </div>
            <div className='flex flex-col flex-1 min-w-0'>
                <p className='text-secondary font-medium truncate'>
                    {track.title}
                </p>
                <p className='text-tertiary text-sm truncate'>{track.artist}</p>
            </div>
            <div className='opacity-0 group-hover:opacity-100 transition-opacity shrink-0'>
                <div className='flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground'>
                    <Plus className='w-4 h-4' />
                </div>
            </div>
        </button>
    );
};

export const AddSongsDialog = (props: AddSongsDialogProps) => {
    const { open, onOpenChange, libraryTracks, playlistTrackIds, onAddSong } =
        props;
    const [searchQuery, setSearchQuery] = useState('');

    const availableTracks = useMemo(() => {
        if (!libraryTracks) return [];
        return libraryTracks.filter(track => !playlistTrackIds.has(track.id));
    }, [libraryTracks, playlistTrackIds]);

    const filteredTracks = useMemo(() => {
        if (!searchQuery.trim()) return availableTracks;
        const query = searchQuery.toLowerCase();
        return availableTracks.filter(
            track =>
                track.title.toLowerCase().includes(query) ||
                track.artist.toLowerCase().includes(query)
        );
    }, [availableTracks, searchQuery]);

    const handleAddSong = (trackId: number) => {
        onAddSong(trackId);
    };

    return (
        <Dialog modal={false} open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-3xl max-h-[85vh] flex flex-col bg-black text-white'>
                <DialogHeader>
                    <DialogTitle>Add Songs to Playlist</DialogTitle>
                    <DialogDescription>
                        {availableTracks.length > 0
                            ? `${availableTracks.length} song${availableTracks.length !== 1 ? 's' : ''} available to add`
                            : 'No songs available to add'}
                    </DialogDescription>
                </DialogHeader>
                {availableTracks.length > 0 && (
                    <div className='relative'>
                        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary' />
                        <Input
                            placeholder='Search songs...'
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className='pl-9'
                        />
                    </div>
                )}
                <div className='flex flex-col gap-1 flex-1 overflow-y-auto py-2 min-h-0'>
                    {filteredTracks.length > 0 ? (
                        filteredTracks.map(track => (
                            <TrackItem
                                key={track.id}
                                track={track}
                                onAdd={() => handleAddSong(track.id)}
                            />
                        ))
                    ) : availableTracks.length > 0 ? (
                        <div className='flex flex-col items-center justify-center py-12 text-center'>
                            <Search className='w-12 h-12 text-tertiary mb-4 opacity-50' />
                            <p className='text-tertiary font-medium'>
                                No songs found
                            </p>
                            <p className='text-tertiary text-sm mt-1'>
                                Try a different search term
                            </p>
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center py-12 text-center'>
                            <Music className='w-12 h-12 text-tertiary mb-4 opacity-50' />
                            <p className='text-tertiary font-medium'>
                                No songs available
                            </p>
                            <p className='text-tertiary text-sm mt-1'>
                                All songs are already in this playlist
                            </p>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        className='bg-white text-black'
                        variant='outline'
                        onClick={() => {
                            setSearchQuery('');
                            onOpenChange(false);
                        }}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
