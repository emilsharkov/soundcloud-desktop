export interface SongProps {
    title: string;
    imageSrc: string;
    waveform: number[];
}

const Song = (props: SongProps) => {
    const { title, imageSrc, waveform } = props
    return (
        <></>
    )
}

export { Song }