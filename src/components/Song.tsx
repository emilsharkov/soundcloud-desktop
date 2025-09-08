import { Track } from "@/models/response";
import { Waveform } from "./Waveform";
import { useTauriInvoke } from "@/hooks/useTauriInvoke";
import { TrackWaveformQuery } from "@/models/query";
import { useAudioContext } from "@/models/audio/AudioContext";
import { Play, Pause } from "lucide-react";

export interface SongProps {
    track: Track;
}

const Song = (props: SongProps) => {
    const { track } = props;
    const { paused, setPaused, setQueue } = useAudioContext();

    const { data: waveform } = useTauriInvoke<TrackWaveformQuery,Waveform>(
        "get_track_waveform", { 
            track: track
        }
    );

    // const isCurrentTrack = selectedTrackId === trackIdString;
    const isPlaying = !paused;

    const handlePlayPause = () => {
        // if (isCurrentTrack) {
        //     setPaused(!paused);
        // } else {
            setQueue([track]);
            setPaused(false);
        // }
    };

    return (
        <>
            {waveform && (
                <div className="flex flex-row w-full items-center gap-4">
                    <div className="relative group">
                        <img 
                            className="w-[125px] h-[125px] rounded-lg object-cover" 
                            src={track.artwork_url} 
                            alt={`${track.title} artwork`}
                        />
                        <button 
                            className="absolute inset-0 m-auto w-12 h-12 bg-white/90 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
                            onClick={handlePlayPause}
                        >
                            {isPlaying ? (
                                <Pause className="w-6 h-6 text-black ml-0.5" />
                            ) : (
                                <Play className="w-6 h-6 text-black ml-1" />
                            )}
                        </button>
                    </div>
                    <div className="flex flex-col flex-1">
                        <div className="flex-1">
                            <p className="text-tertiary">
                                {track.title}
                            </p>
                            <p className="text-secondary">
                                {track.user?.username}
                            </p>
                        </div>
                        <div className="flex flex-1">
                            <Waveform waveform={waveform} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export { Song } 