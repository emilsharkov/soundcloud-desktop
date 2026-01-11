import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { TrackRow } from '@/types/schemas';
import { Plus } from 'lucide-react';

interface AddSongsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    libraryTracks: TrackRow[] | undefined;
    playlistTrackIds: Set<number>;
    onAddSong: (trackId: number) => void;
}

export const AddSongsDialog = (props: AddSongsDialogProps) => {
    const { open, onOpenChange, libraryTracks, playlistTrackIds, onAddSong } =
        props;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-2xl max-h-[80vh]'>
                <DialogHeader>
                    <DialogTitle>Add Songs to Playlist</DialogTitle>
                    <DialogDescription>
                        Select songs from your library to add to this playlist.
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-2 max-h-[60vh] overflow-y-auto py-4'>
                    {libraryTracks && libraryTracks.length > 0 ? (
                        libraryTracks
                            .filter(track => !playlistTrackIds.has(track.id))
                            .map(track => (
                                <button
                                    key={track.id}
                                    className='flex flex-row items-center gap-3 p-3 rounded-lg hover:bg-accent text-left'
                                    onClick={() => {
                                        onAddSong(track.id);
                                    }}
                                >
                                    <div className='flex flex-col flex-1 min-w-0'>
                                        <p className='text-secondary font-medium truncate'>
                                            {track.title}
                                        </p>
                                        <p className='text-tertiary text-sm truncate'>
                                            {track.artist}
                                        </p>
                                    </div>
                                    <Plus className='w-5 h-5 text-tertiary shrink-0' />
                                </button>
                            ))
                    ) : (
                        <p className='text-tertiary text-center py-8'>
                            No songs available to add
                        </p>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        variant='outline'
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
