import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTauriMutation } from '@/hooks/data/mutation/useTauriMutation';
import { useTauriQuery } from '@/hooks/data/query/useTauriQuery';
import { TrackIdQuery } from '@/models/query';
import { Track } from '@/models/response';
import { useQueryClient } from '@tanstack/react-query';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { EditMetadataModal } from './EditMetadataModal';

interface SettingsProps {
    trackId: number;
    title: string;
    artist: string;
    artworkPath: string;
}

const Settings = (props: SettingsProps) => {
    const { trackId, title, artist, artworkPath } = props;
    const queryClient = useQueryClient();
    const { isLoading, isError } = useTauriQuery<TrackIdQuery, Track>(
        'get_local_track',
        {
            id: trackId,
        },
        {
            retry: false,
        }
    );

    const { mutate: deleteTrack } = useTauriMutation<TrackIdQuery, Track>(
        'delete_local_track',
        {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['get_local_tracks'],
                });
                queryClient.invalidateQueries({
                    queryKey: ['get_local_track', trackId],
                });
                toast.success('Track deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete track');
            },
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

    const handleDelete = () => {
        deleteTrack({ id: trackId });
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
                        trackId={trackId}
                        title={title}
                        artist={artist}
                        artworkPath={artworkPath}
                    />
                </>
            ) : null}
        </>
    );
};

export { Settings };
