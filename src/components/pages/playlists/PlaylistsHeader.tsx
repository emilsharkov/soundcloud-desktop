import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PlaylistsHeaderProps {
    onCreateClick: () => void;
}

export const PlaylistsHeader = (props: PlaylistsHeaderProps) => {
    const { onCreateClick } = props;

    return (
        <div className='flex flex-row items-center justify-between'>
            <h1 className='text-2xl font-semibold text-secondary'>Playlists</h1>
            <Button onClick={onCreateClick} className='shrink-0'>
                <Plus className='w-4 h-4 mr-2' />
                New Playlist
            </Button>
        </div>
    );
};
