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

interface CreatePlaylistDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    playlistName: string;
    onPlaylistNameChange: (name: string) => void;
    onCreate: () => void;
    onCancel: () => void;
}

export const CreatePlaylistDialog = (props: CreatePlaylistDialogProps) => {
    const {
        open,
        onOpenChange,
        playlistName,
        onPlaylistNameChange,
        onCreate,
        onCancel,
    } = props;

    return (
        <Dialog modal={false} open={open} onOpenChange={onOpenChange}>
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
                        value={playlistName}
                        onChange={e => onPlaylistNameChange(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                onCreate();
                            }
                        }}
                        autoFocus
                    />
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={onCreate}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
