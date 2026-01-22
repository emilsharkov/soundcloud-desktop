import { useDownloadTrackMutation } from '@/hooks/useDownloadTrackMutation';
import { useLocalTrackRow } from '@/hooks/useLocalTrackRow';
import { Check, LoaderCircle, LucideDownload } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

interface DownloadProps {
    trackId: number;
}

const Download = (props: DownloadProps) => {
    const { trackId } = props;
    const [downloading, setDownloading] = useState<boolean>(false);

    const { data: localTrack, isLoading, isError } = useLocalTrackRow(trackId);

    const { downloadTrack } = useDownloadTrackMutation(trackId, {
        onSettled: () => {
            setDownloading(false);
        },
    });

    const handleDownload = async () => {
        setDownloading(true);
        downloadTrack({ id: trackId });
    };

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
