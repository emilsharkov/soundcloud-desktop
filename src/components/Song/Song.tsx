import { Track } from "@/models/response";
import { Waveform } from "./Waveform";
import { useAudioContext } from "@/context/AudioContext";
import { Play, Pause } from "lucide-react";
import { Download } from "./Download";
import { Settings } from "./Settings/Settings";

export interface SongProps {
    track: Track;
}

const Song = (props: SongProps) => {
    const { track } = props;
    const { title, user, artwork_url } = track
    const { tracks, currentIndex, paused, setPaused, setQueue } = useAudioContext();
    
    const isCurrentTrack = tracks[currentIndex]?.id === track.id;
    const isPlaying = !paused && isCurrentTrack;

    const handlePlayPause = () => {
        if (isCurrentTrack) {
            setPaused(!paused);
        } else {
            setQueue([track]);
            setPaused(false);
        }
    };

    return (
        <div className="flex flex-row w-full items-center gap-4">
            <div className="relative group">
                <img 
                    className="w-[125px] h-[125px] rounded-lg object-cover" 
                    src={artwork_url} 
                    alt={`${title} artwork`}
                />
                <button 
                    className="absolute inset-0 m-auto w-12 h-12 bg-white/90 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
                    onClick={handlePlayPause}
                >
                    {isPlaying ? (
                        <Pause className="w-6 h-6 text-black" />
                    ) : (
                        <Play className="w-6 h-6 text-black" />
                    )}
                </button>
            </div>
            <div className="flex flex-col flex-1">
                <div className="flex-1">
                    <div className="flex flex-row items-center gap-2">
                        <p className="text-tertiary">
                            {title}
                        </p>
                        <Download track={track} />
                        <Settings track={track} />
                    </div>
                    <p className="text-secondary">
                        {user?.username}
                    </p>
                </div>
                <div className="flex flex-1">
                    <Waveform track={track} />
                </div>
            </div>
        </div>
    )
}

export { Song } 