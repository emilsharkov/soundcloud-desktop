import { forwardRef } from 'react';

interface WaveformBarProps {
    samples: number[];
    sampleIndex: number;
}

const WaveformBar = forwardRef<HTMLDivElement, WaveformBarProps>(
    ({ samples, sampleIndex }, ref) => {
        return (
            <div
                ref={ref}
                className='gap-[1px] flex-1 flex flex-row items-center cursor-pointer overflow-hidden w-full'
            >
                {samples.map((sample, index) => {
                    return (
                        <div
                            key={index}
                            className='w-[2px]'
                            style={{
                                height: `${sample}px`,
                                backgroundColor:
                                    sampleIndex >= index ? 'orange' : 'white',
                            }}
                        />
                    );
                })}
            </div>
        );
    }
);

WaveformBar.displayName = 'WaveformBar';

export { WaveformBar };
