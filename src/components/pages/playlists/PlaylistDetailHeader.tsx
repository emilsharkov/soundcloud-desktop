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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PlaylistDetailHeaderProps {
    name: string;
    onBack: () => void;
    onAddSongs: () => void;
    onDelete: () => void;
}

export const PlaylistDetailHeader = (props: PlaylistDetailHeaderProps) => {
    const { name, onBack, onAddSongs, onDelete } = props;
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        // Close dialog first, then delete after a small delay to allow animation
        setDeleteDialogOpen(false);
        // Use setTimeout to ensure dialog closes before component unmounts
        setTimeout(() => {
            onDelete();
        }, 200);
    };

    return (
        <>
            <div className='flex flex-row items-center gap-4'>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={onBack}
                    className='shrink-0'
                >
                    <ArrowLeft className='w-5 h-5' />
                </Button>
                <h1 className='text-2xl font-semibold text-secondary flex-1'>
                    {name}
                </h1>
                <Button size='sm' onClick={onAddSongs} className='shrink-0'>
                    <Plus className='w-4 h-4 mr-2' />
                    Add Songs
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size='icon' className='shrink-0'>
                            <MoreVertical className='w-5 h-5' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                            variant='destructive'
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            <Trash2 className='w-4 h-4' />
                            Delete Playlist
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                        <DialogTitle>Delete Playlist</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{name}"? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant='destructive' onClick={handleDelete}>
                            Delete Playlist
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
