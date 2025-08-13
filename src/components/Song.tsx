import { Waveform } from "./Waveform";

export interface SongProps {
    title: string;
    artist: string;
    imageSrc: string;
    waveform: Waveform;
}

const Song = (props: SongProps) => {
    const { title, artist, imageSrc, waveform } = props

    return (
        <div className="flex flex-row w-full">
            <img className="w-[200] h-[200]" src={imageSrc} />
            <div className="flex flex-col flex-1">
               <div className="w-full">
                    <p className="text-tertiary">
                        {title}
                    </p>
                    <p className="text-secondary">
                        {artist}
                    </p>
               </div>
               <div className="w-full">
                    <Waveform waveform={waveform} />
               </div>
            </div>
        </div>
    )
}

export { Song } 