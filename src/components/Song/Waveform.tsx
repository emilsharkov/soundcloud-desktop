import { useWaveform } from '@/hooks/useWaveform';
import { useAudio } from '@/providers/AudioProvider';
import { type Waveform } from '@/types/schemas';
import { getSampleColor } from '@/utils/getSampleColor';
import { useEffect, useState } from 'react';

export interface WaveformProps {
    trackId: number;
    waveform: Waveform;
}

const Waveform = (props: WaveformProps) => {
    const { waveform, trackId } = props;
    const { selectedTrackId, playbackTime, duration, setTime } = useAudio();
    const [hoveredSample, setHoveredSample] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const { ref, samples } = useWaveform(waveform);

    const currentSample = (playbackTime / duration) * samples.length;
    const isCurrentTrack = selectedTrackId === trackId;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isCurrentTrack) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const end = rect.right - rect.left;
        const percentage = x / end;
        const newTime = Math.floor(percentage * duration);
        setTime(newTime);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isCurrentTrack) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const index = Math.floor(x / 3);
        setHoveredSample(index);
    };

    const handleHoverChange = (isHovered: boolean) => {
        setIsHovered(isHovered);
    };

    useEffect(() => {
        if (!isHovered) {
            setHoveredSample(null);
        }
    }, [isHovered]);

    return (
        <div
            ref={ref}
            className='gap-[1px] flex-1 flex flex-row items-center cursor-pointer overflow-hidden w-full'
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => handleHoverChange(true)}
            onMouseLeave={() => handleHoverChange(false)}
        >
            {samples.map((sample, index) => {
                const color = getSampleColor(
                    index,
                    currentSample,
                    hoveredSample,
                    isCurrentTrack
                );

                return (
                    <div
                        key={index}
                        className='w-[2px]'
                        style={{
                            height: `${sample}px`,
                            backgroundColor: color,
                        }}
                    />
                );
            })}
        </div>
    );
};

export { Waveform };
