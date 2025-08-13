import { Waveform } from "@/models/response";
import { useLayoutEffect, useRef, useState, RefObject, useEffect } from "react";
import { resizeSamples } from "@/lib/resizeSamples";

export interface UseWaveformReturn {
    ref: RefObject<HTMLDivElement | null>;
    samples: number[];
}

const useWaveform = (waveform: Waveform): UseWaveformReturn => {
    const { samples, height } = waveform
    const ref = useRef<HTMLDivElement | null>(null)
    const [containerWidth,setContainerWidth] = useState<number>(0)

    // one sample is 2px
    // formula for width = 2(x)px + (x-1)px
    // container width = 3x - 1 px
    const numSamples = Math.floor((containerWidth + 1) / 3)
    const resizedSamples = resizeSamples(samples, numSamples, 60)

    useLayoutEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setContainerWidth(rect.width);
        }
    }, []);

    useEffect(() => {
        if (!ref.current) return;
        const element = ref.current;
        const observer = new ResizeObserver((entries) => {
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
    }
}

export { useWaveform }