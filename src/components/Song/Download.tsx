import { Track } from '@/models/response';
import { useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { LoaderCircle, LucideDownload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface DownloadProps {
    track: Track;
}

const Download = (props: DownloadProps) => {
    const { track } = props;
    const trackId = track.id?.toString() ?? '';
    const queryClient = useQueryClient();
    const [downloading, setDownloading] = useState<boolean>(false);

    const handleDownload = async () => {
        setDownloading(true);
        await invoke('download_track', { track })
            .then(() => {
                toast.success('Downloaded successfully');
                queryClient.invalidateQueries({
                    queryKey: ['get_local_track', trackId],
                });
            })
            .catch(() => {
                toast.error('Failed to download');
            })
            .finally(() => {
                setDownloading(false);
            });
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
