import { Waveform } from "@/App";

export interface SongProps {
    title: string;
    imageSrc: string;
    waveform: Waveform;
}

const Song = (props: SongProps) => {
    const { title, imageSrc, waveform } = props
    return (
        <></>
    )
}

export { Song }