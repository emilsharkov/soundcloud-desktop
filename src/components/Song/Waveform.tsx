import { useAudioContext } from '@/context/AudioContext';
import { useTauriInvoke } from '@/hooks/useTauriInvoke';
import { useWaveform } from '@/hooks/useWaveform';
import { getSampleColor } from '@/lib/getSampleColor';
import { TrackWaveformQuery } from '@/models/query';
import { Track, type Waveform } from '@/models/response';
import { useEffect, useState } from 'react';

export interface WaveformProps {
    track: Track;
}

const Waveform = (props: WaveformProps) => {
    const { track } = props;
    const { currentIndex, tracks, playbackTime, duration, setTime } =
        useAudioContext();
    const [hoveredSample, setHoveredSample] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const { data: waveform } = useTauriInvoke<TrackWaveformQuery, Waveform>(
        'get_track_waveform',
        {
            track: track,
        }
    );
    const { ref, samples } = useWaveform(waveform);

    const currentSample = (playbackTime / duration) * samples.length;
    const isCurrentTrack = tracks[currentIndex]?.id === track.id;

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
            className='gap-[1px] flex-1 flex flex-row items-center cursor-pointer'
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
