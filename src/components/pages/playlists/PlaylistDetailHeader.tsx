import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface PlaylistDetailHeaderProps {
    name: string;
    onBack: () => void;
    onAddSongs: () => void;
    onDelete: () => void;
}

export const PlaylistDetailHeader = (props: PlaylistDetailHeaderProps) => {
    const { name, onBack, onAddSongs, onDelete } = props;

    return (
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
            <Button
                variant='outline'
                size='sm'
                onClick={onAddSongs}
                className='shrink-0'
            >
                <Plus className='w-4 h-4 mr-2' />
                Add Songs
            </Button>
            <Button
                variant='destructive'
                size='sm'
                onClick={onDelete}
                className='shrink-0'
            >
                <Trash2 className='w-4 h-4 mr-2' />
                Delete Playlist
            </Button>
        </div>
    );
};
