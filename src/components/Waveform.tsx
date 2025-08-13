import { type Waveform } from "@/models/response"
import { useLayoutEffect, useRef, useState } from "react";

export interface WaveformProps {
    waveform: Waveform;
}

const Waveform = (props: WaveformProps) => {
    const { waveform } = props
    

    return (
        <div ref={ref} className="border border-white">

        </div>
    )
}

export { Waveform }