import { QueueContext, useQueueStrategy } from '@/hooks/useQueueStrategy';
import { useAudio } from '@/providers/AudioProvider';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { Waveform } from './Waveform';

export interface SongProps {
    trackId: number;
    title: string;
    artist: string;
    artwork: string;
    waveform: Waveform;
    buttonBar?: React.ReactNode;
    queueContext?: QueueContext;
}

const Song = (props: SongProps) => {
    const {
        trackId,
        title,
        artist,
        artwork,
        waveform,
        buttonBar,
        queueContext,
    } = props;
    const { paused, selectedTrackId, setPaused } = useAudio();
    const { playTrack } = useQueueStrategy(queueContext);

    const isCurrentTrack = selectedTrackId === trackId;
    const isPlaying = !paused && isCurrentTrack;
    const PlaybackIcon = isPlaying ? PauseIcon : PlayIcon;

    const handlePlayPause = () => {
        if (isCurrentTrack) {
            setPaused(!paused);
        } else {
            playTrack(trackId);
        }
    };

    return (
        <div className='flex flex-row w-full items-center gap-4'>
            <div className='relative group'>
                <img
                    className='size-[125px] min-w-[125px] min-h-[125px] aspect-square rounded-lg object-cover'
                    src={artwork}
                />
                <button
                    className='absolute inset-0 m-auto w-12 h-12 bg-white/90 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl'
                    onClick={handlePlayPause}
                >
                    <PlaybackIcon className='w-6 h-6 text-black' />
                </button>
            </div>
            <div className='flex flex-col flex-1 min-w-0'>
                <div className='flex-shrink-0'>
                    <div className='flex flex-row items-center gap-3'>
                        <p className='text-tertiary'>{artist}</p>
                        {buttonBar !== undefined && (
                            <div className='flex flex-row items-center gap-2'>
                                {buttonBar}
                            </div>
                        )}
                    </div>
                    <p className='text-secondary'>{title}</p>
                </div>
                <div className='flex flex-1 max-w-full'>
                    <Waveform trackId={trackId} waveform={waveform} />
                </div>
            </div>
        </div>
    );
};

export { Song };
