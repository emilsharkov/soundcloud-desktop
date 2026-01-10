import { useTauriMutation } from '@/hooks/useTauriMutation';
import { useTauriQuery } from '@/hooks/useTauriQuery';
import { IdQuery } from '@/types/query';
import { TrackRow } from '@/types/schemas';
import { useQueryClient } from '@tanstack/react-query';
import { Check, LoaderCircle, LucideDownload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface DownloadProps {
    trackId: number;
}

const Download = (props: DownloadProps) => {
    const { trackId } = props;
    const queryClient = useQueryClient();
    const [downloading, setDownloading] = useState<boolean>(false);

    const {
        data: localTrack,
        isLoading,
        isError,
    } = useTauriQuery<IdQuery, TrackRow>('get_local_track', { id: trackId });

    const { mutate: downloadTrack } = useTauriMutation<IdQuery, void>(
        'download_track',
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: ['get_local_track', trackId],
                });
                toast.success('Downloaded successfully');
            },
            onError: error => {
                console.error('Failed to download', error);
                toast.error('Failed to download');
            },
            onSettled: () => {
                setDownloading(false);
            },
        }
    );

    const handleDownload = async () => {
        setDownloading(true);
        downloadTrack({ id: trackId });
    };

    if (trackId === 2110830129) {
        console.log(localTrack, isLoading, isError);
    }
    const isLocalTrack = localTrack !== undefined && !isLoading && !isError;

    return isLocalTrack ? (
        <Check className='w-4 h-4 text-secondary' />
    ) : (
        <Button
            className='hover:bg-transparent cursor-pointer'
            size='icon'
            variant='ghost'
            onClick={handleDownload}
            disabled={downloading}
        >
            {downloading ? (
                <LoaderCircle className='w-4 h-4 text-secondary animate-spin' />
            ) : (
                <LucideDownload className='w-4 h-4 text-secondary' />
            )}
        </Button>
    );
};

export { Download };
