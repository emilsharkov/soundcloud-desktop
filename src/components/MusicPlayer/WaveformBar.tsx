import { useAudio } from '@/providers/AudioProvider';

interface WaveformBarProps {
    ref: React.RefObject<HTMLDivElement | null>;
    samples: number[];
    sampleIndex: number;
}

const WaveformBar = (props: WaveformBarProps) => {
    const { ref, samples, sampleIndex } = props;
    const { paused } = useAudio();
    return (
        <div
            ref={ref}
            className='gap-[1px] flex-1 flex flex-row items-center cursor-pointer overflow-hidden w-full'
        >
            {samples.map((sample, index) => {
                return (
                    <div
                        key={index}
                        className='w-[2px] transition-all duration-100'
                        style={{
                            height: !paused ? `${sample * 2}px` : '4px',
                            backgroundColor:
                                sampleIndex >= index ? '#ff4900' : 'white',
                        }}
                    />
                );
            })}
        </div>
    );
};

export { WaveformBar };
