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
        <div className="flex flex-row w-full items-center gap-4">
            <img className="w-[125px] h-[125px]" src={imageSrc} />
            <div className="flex flex-col flex-1">
               <div className="flex-1">
                    <p className="text-tertiary">
                        {title}
                    </p>
                    <p className="text-secondary">
                        {artist}
                    </p>
               </div>
               <div className="flex flex-1">
                    <Waveform waveform={waveform} />
               </div>
            </div>
        </div>
    )
}

export { Song } 