\import { Waveform } from "@/models/response";

export interface SongProps {
    title: string;
    imageSrc: string;
    waveform: Waveform;
}

const Song = (props: SongProps) => {
    const { title, imageSrc, waveform } = props

    return (
        <div className="flex flex-col gap-2">
            <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
            <p className="text-sm text-gray-500">{title}</p>
        </div>
    )
}

export { Song } 