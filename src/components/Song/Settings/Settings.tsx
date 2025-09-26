import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTauriInvoke } from '@/hooks/useTauriInvoke';
import { Track } from '@/models/response';
import { useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { TrackQuery } from '../Song';
import { EditMetadataModal } from './EditMetadataModal';

interface SettingsProps {
    track: Track;
}

const Settings = (props: SettingsProps) => {
    const { track } = props;
    const queryClient = useQueryClient();
    const trackId = track.id?.toString() ?? '';
    const { isLoading, isError } = useTauriInvoke<TrackQuery, Track>(
        'get_local_track',
        {
            id: trackId,
        },
        {
            retry: false,
        }
    );

    const isLocalTrack = !isLoading && !isError;

    const [editMetadataModalOpen, setEditMetadataModalOpen] =
        useState<boolean>(false);

    const handleEditMetadata = () => {
        setEditMetadataModalOpen(true);
    };

    const handleAddToPlaylist = () => {
        toast.message('Add to playlist', {
            description: 'Coming soon',
        });
    };

    const handleDelete = async () => {
        await invoke('delete_local_track', { id: trackId });
        queryClient.invalidateQueries({
            queryKey: ['get_local_track', trackId],
        });
        queryClient.invalidateQueries({ queryKey: ['get_local_tracks'] });
        toast.success('Track deleted successfully');
    };

    return (
        <>
            {isLocalTrack ? (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className='hover:bg-transparent cursor-pointer'
                                variant='ghost'
                                size='icon'
                            >
                                <MoreVertical className='w-4 h-4 text-secondary' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='start'>
                            <DropdownMenuItem onClick={handleEditMetadata}>
                                Edit metadata
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleAddToPlaylist}>
                                Add to playlist
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDelete}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <EditMetadataModal
                        open={editMetadataModalOpen}
                        onOpenChange={setEditMetadataModalOpen}
                        track={track}
                    />
                </>
            ) : null}
        </>
    );
};

export { Settings };
