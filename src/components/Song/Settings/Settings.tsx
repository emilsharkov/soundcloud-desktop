import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTauriMutation } from '@/hooks/data/mutation/useTauriMutation';
import { useTauriQuery } from '@/hooks/data/query/useTauriQuery';
import { IdQuery } from '@/models/query';
import { Track } from '@/models/schemas';
import { useQueryClient } from '@tanstack/react-query';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { EditMetadataModal } from './EditMetadataModal';

interface SettingsProps {
    trackId: number;
    title: string;
    artist: string;
}

const Settings = (props: SettingsProps) => {
    const { trackId, title, artist } = props;
    const queryClient = useQueryClient();
    const { data: localTrack } = useTauriQuery<IdQuery, Track>(
        'get_local_track',
        {
            id: trackId,
        }
    );

    const { mutate: deleteTrack } = useTauriMutation<IdQuery, Track>(
        'delete_local_track',
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: ['get_local_tracks'],
                });
                await queryClient.invalidateQueries({
                    queryKey: ['get_local_track', trackId],
                });
                await queryClient.invalidateQueries({
                    queryKey: ['get_song_image', trackId],
                });
                toast.success('Track deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete track');
            },
        }
    );

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
            {localTrack !== undefined ? (
                <>
                    <DropdownMenu modal={false}>
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
                    />
                </>
            ) : null}
        </>
    );
};

export { Settings };
