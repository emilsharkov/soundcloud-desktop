import { Waveform } from "@/App";
import AdaptiveAudio from "./AdaptiveAudio";
import { useRef } from "react";

export interface SongProps {
    title: string;
    imageSrc: string;
    waveform: Waveform;
}

const Song = (props: SongProps) => {
    const { title, imageSrc, waveform } = props
    const audioRef = useRef<HTMLAudioElement | null>(null);    

    return (
        <AdaptiveAudio ref={audioRef} controls src={""} />
    )
}

export { Song } 