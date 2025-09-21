import { resizeSamples } from '@/lib/resizeSamples';
import { Waveform } from '@/models/response';
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface UseWaveformReturn {
    ref: RefObject<HTMLDivElement | null>;
    samples: number[];
}

const useWaveform = (waveform: Waveform | undefined): UseWaveformReturn => {
    const { samples } = waveform ?? { samples: [], height: 0 };
    const ref = useRef<HTMLDivElement | null>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);

    // one sample is 2px
    // formula for width = 2(x)px + (x-1)px
    // container width = 3x - 1 px
    const numSamples = Math.floor((containerWidth + 1) / 3);
    const resizedSamples = resizeSamples(samples, numSamples, 60);

    useLayoutEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setContainerWidth(rect.width);
        }
    }, []);

    useEffect(() => {
        if (!ref.current) return;
        const element = ref.current;
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                setContainerWidth(width);
            }
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return {
        ref,
        samples: resizedSamples,
    };
};

export { useWaveform };
