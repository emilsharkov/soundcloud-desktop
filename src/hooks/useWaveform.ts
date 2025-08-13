import { Waveform } from "@/models/response";
import { useLayoutEffect, useRef, useState, RefObject } from "react";

export interface UseWaveformReturn {
    ref: RefObject<HTMLDivElement | null>;
}

const useWaveform = (waveform: Waveform): UseWaveformReturn => {
    const { width, height, samples } = waveform
    const ref = useRef<HTMLDivElement | null>(null)
    const [containerWidth,setContainerWidth] = useState<number>(0)

    const 

    useLayoutEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setContainerWidth(rect.width);
        }
    }, []);

    return {
        ref
    }
}