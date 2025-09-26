import { useAudioContext } from '@/context/audio/AudioContext';
import * as SliderPrimitive from '@radix-ui/react-slider';

const Seeker = () => {
    const { playbackTime, duration, selectedTrackId, setTime } =
        useAudioContext();
    const disabled = selectedTrackId === null;

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSeekerChange = (value: number[]) => {
        if (disabled) return;
        setTime(value[0]);
    };

    return (
        <div className='w-[300px] h-full flex flex-row items-center justify-center gap-2'>
            <p className='text-secondary text-xs text-nowrap'>
                {disabled ? '-:--' : formatTime(playbackTime)}
            </p>
            <SliderPrimitive.Root
                data-slot='slider'
                disabled={disabled}
                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                value={[playbackTime]}
                min={0}
                max={duration}
                onValueChange={handleSeekerChange}
                className='relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col'
            >
                <SliderPrimitive.Track
                    data-slot='slider-track'
                    className='bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5'
                >
                    <SliderPrimitive.Range
                        data-slot='slider-range'
                        className='bg-[#ff4900] absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full'
                    />
                </SliderPrimitive.Track>
            </SliderPrimitive.Root>
            <p className='text-secondary text-xs text-nowrap'>
                {disabled ? '-:--' : formatTime(duration)}
            </p>
        </div>
    );
};

export { Seeker };
