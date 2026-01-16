import { useWaveform } from '@/hooks/useWaveform';
import { cn } from '@/lib/utils';
import { useAudio } from '@/providers/AudioProvider';
import { Waveform } from '@/types/schemas/response/local';
import { useDraggable } from '@dnd-kit/core';
import { ChevronDown, Play, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '../ui/button';
import { WaveformBar } from './WaveformBar';

interface FullscreenPlayerStageProps {
    title?: string;
    artist?: string;
    artwork?: string;
    onClose: () => void;
    width: number;
    percentageCompleted: number;
    waveform: Waveform;
}

const FullscreenPlayerStage = (props: FullscreenPlayerStageProps) => {
    const {
        title,
        artist,
        artwork,
        onClose,
        percentageCompleted,
        width,
        waveform,
    } = props;
    const { paused, setPaused, playbackTime, duration } = useAudio();
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: 'fullscreen-player',
    });
    const { ref, samples } = useWaveform(waveform);
    const sampleIndex = Math.floor(percentageCompleted * (samples.length - 1));
    const position = Math.floor(percentageCompleted * width * -1);

    const style = {
        backgroundImage: `url(${artwork})`,
        width: '200vw',
        transform: `translate3d(${position}px, 0, 0)`,
    };

    const handleTogglePlayback = () => {
        if (isDragging) return;
        setPaused(!paused);
    };

    const formatTime = (time: number) => {
        if (!Number.isFinite(time) || time < 0) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <>
            <div className='fixed w-fit h-fit z-60 inset-0 flex flex-col items-start justify-start p-4'>
                <div className='flex flex-col items-start justify-start gap-0'>
                    <h1 className='text-2xl font-bold bg-black px-2 pt-1'>
                        {title}
                    </h1>
                    <p className='text-xl text-gray-500 bg-black px-2 pb-1'>
                        {artist}
                    </p>
                </div>
            </div>
            <div className='fixed w-fit h-fit z-60 right-10 top-0 p-4'>
                <Button
                    onClick={onClose}
                    className='bg-black rounded-full size-10 flex items-center justify-center'
                >
                    <ChevronDown className='size-7 text-white' />
                </Button>
            </div>
            <div className='absolute left-0 right-0 top-3/5 h-10 z-60 flex items-center justify-center pointer-events-none'>
                <span className='bg-black/60 text-white px-3 py-1 rounded-full text-sm'>
                    {formatTime(playbackTime)} | {formatTime(duration)}
                </span>
            </div>
            <div
                className={cn(
                    'fixed inset-0 z-60 flex items-center justify-center ml-[200px] transition-opacity duration-200 ease-out pointer-events-none',
                    paused ? 'opacity-100' : 'opacity-0 '
                )}
            >
                <button
                    type='button'
                    onClick={handleTogglePlayback}
                    className='cursor-pointer bg-black rounded-full size-12 flex items-center justify-center'
                >
                    <SkipForward className='size-6 text-white fill-white' />
                </button>
            </div>
            <div
                className={cn(
                    'fixed inset-0 z-60 flex items-center justify-center transition-opacity duration-200 ease-out pointer-events-none',
                    paused ? 'opacity-100' : 'opacity-0 '
                )}
            >
                <button
                    type='button'
                    onClick={handleTogglePlayback}
                    className='cursor-pointer bg-black rounded-full size-16 flex items-center justify-center'
                >
                    <Play className='size-8 text-white fill-white' />
                </button>
            </div>
            <div
                className={cn(
                    'fixed inset-0 z-60 flex items-center justify-center mr-[200px] transition-opacity duration-200 ease-out pointer-events-none',
                    paused ? 'opacity-100' : 'opacity-0 '
                )}
            >
                <button
                    type='button'
                    onClick={handleTogglePlayback}
                    className='cursor-pointer bg-black rounded-full size-12 flex items-center justify-center'
                >
                    <SkipBack className='size-6 text-white fill-white' />
                </button>
            </div>
            <div
                ref={setNodeRef}
                className='fixed top-0 left-0 h-full z-50 cursor-grab active:cursor-grabbing bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center'
                style={style}
                onClick={handleTogglePlayback}
                {...listeners}
                {...attributes}
            >
                <div
                    className={cn(
                        'absolute inset-0 bg-black/40 z-0',
                        paused && 'backdrop-blur-md'
                    )}
                />
                <div className='absolute left-[50vw] h-10 w-[100vw] top-3/5 z-10'>
                    <WaveformBar
                        ref={ref}
                        samples={samples}
                        sampleIndex={sampleIndex}
                    />
                </div>
            </div>
        </>
    );
};

export { FullscreenPlayerStage };
