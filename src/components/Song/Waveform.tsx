import { useWaveform } from '@/hooks/useWaveform';
import { getSampleColor } from '@/lib/getSampleColor';
import { type Waveform } from '@/models/response';
import { useEffect, useState } from 'react';
import { useAudioContext } from '@/context/AudioContext';
import { useTauriInvoke } from '@/hooks/useTauriInvoke';
import { Track } from '@/models/response';
import { TrackWaveformQuery } from '@/models/query';

export interface WaveformProps {
    track: Track;
}

const Waveform = (props: WaveformProps) => {
    const { track } = props;
    const { data: waveform } = useTauriInvoke<TrackWaveformQuery, Waveform>(
        'get_track_waveform',
        {
            track: track,
        }
    );
    const { ref, samples } = useWaveform(waveform);
    const [hoveredSample, setHoveredSample] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const { playbackTime, duration, setTime } = useAudioContext();
    const currentSample = (playbackTime / duration) * samples.length;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const end = rect.right - rect.left;
        const percentage = x / end;
        const newTime = Math.floor(percentage * duration);
        setTime(newTime);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const index = Math.floor(x / 3);
        setHoveredSample(index);
    };

    useEffect(() => {
        if (!isHovered) {
            setHoveredSample(null);
        }
    }, [isHovered]);

    return (
        <div
            ref={ref}
            className='gap-[1px] flex-1 flex flex-row items-center'
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {samples.map((sample, index) => {
                const color = getSampleColor(
                    index,
                    currentSample,
                    hoveredSample
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
