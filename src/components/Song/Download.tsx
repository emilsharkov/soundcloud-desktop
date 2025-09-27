import { useTauriMutation } from '@/hooks/data/mutation/useTauriMutation';
import { TrackIdQuery } from '@/models/query';
import { useQueryClient } from '@tanstack/react-query';
import { LoaderCircle, LucideDownload } from 'lucide-react';
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
    const { mutate: downloadTrack } = useTauriMutation<TrackIdQuery, void>(
        'download_track',
        {
            onSuccess: () => {
                toast.success('Downloaded successfully');
                queryClient.invalidateQueries({
                    queryKey: ['get_local_track', trackId],
                });
            },
            onError: () => {
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

    return (
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
