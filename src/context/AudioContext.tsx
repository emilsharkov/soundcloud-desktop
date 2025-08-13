import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import fluxxwaveMp3 from "../assets/Fluxxwave.mp3";

export interface AudioContextType {
    audioRef: React.RefObject<HTMLAudioElement | null>;
    selectedTrackId: string | null;
    playbackTime: number;
    duration: number;
    src: string;
    paused: boolean;
    setSelectedTrackId: (trackId: string | null) => void;
    setTime: (time: number) => void;
    resetSong: () => void;
    setSrc: (src: string) => void;
    setPaused: (paused: boolean) => void;
}

interface AudioState {
    selectedTrackId: string | null;
    playbackTime: number;
    duration: number;
    src: string;
    paused: boolean;
}

type AudioAction =
    | { type: "SET_SELECTED_TRACK_ID"; payload: string | null }
    | { type: "SET_PLAYBACK_TIME"; payload: number }
    | { type: "SET_DURATION"; payload: number }
    | { type: "SET_SRC"; payload: string }
    | { type: "SET_PAUSED"; payload: boolean }
    | { type: "RESET_SONG" };

const initialState: AudioState = {
    selectedTrackId: null,
    playbackTime: 0,
    duration: 0,
    src: fluxxwaveMp3,
    paused: true,
};

const audioReducer = (state: AudioState, action: AudioAction): AudioState => {
    switch (action.type) {
        case "SET_SELECTED_TRACK_ID":
            return { ...state, selectedTrackId: action.payload };
        case "SET_PLAYBACK_TIME":
            return { ...state, playbackTime: action.payload };
        case "SET_DURATION":
            return { ...state, duration: action.payload };
        case "SET_SRC":
            return { ...state, src: action.payload };
        case "RESET_SONG":
            return { ...state, playbackTime: 0 };
        case "SET_PAUSED":
            return { ...state, paused: action.payload };
        default:
            return state;
    }
};

const AudioContext = createContext<AudioContextType>({
    audioRef: { current: null },
    selectedTrackId: null,
    playbackTime: 0,
    duration: 0,
    src: "",
    paused: true,
    setTime: () => {},
    resetSong: () => {},
    setSrc: () => {},
    setSelectedTrackId: () => {},
    setPaused: () => {},
});

export const useAudioContext = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("useAudioContext must be used within an AudioProvider");
    }
    return context;
}

const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [state, dispatch] = useReducer(audioReducer, initialState);

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;

        const onTimeUpdate = () => dispatch({ type: "SET_PLAYBACK_TIME", payload: el.currentTime });
        const onDurationChange = () => dispatch({ type: "SET_DURATION", payload: el.duration });

        el.addEventListener("timeupdate", onTimeUpdate);
        el.addEventListener("durationchange", onDurationChange);
        return () => {
            el.removeEventListener("timeupdate", onTimeUpdate);
            el.removeEventListener("durationchange", onDurationChange);
        };
    }, [audioRef]);

    const setSelectedTrackId = (trackId: string | null) => {
        dispatch({ type: "SET_SELECTED_TRACK_ID", payload: trackId });
    };

    const setTime = (time: number) => {
        const el = audioRef.current;
        if (el) {
            let newTime;
            if(time > el.duration) {
                newTime = el.duration
            } else if(time < 0) {
                newTime = 0
            } else {
                newTime = time;
            }
            el.currentTime = newTime;
            dispatch({ type: "SET_PLAYBACK_TIME", payload: newTime });
        }
    };

    const resetSong = () => {
        const el = audioRef.current;
        if (el) {
            el.pause();
            el.currentTime = 0;
        }
    };

    const setSrc = (src: string) => {
        const el = audioRef.current;
        if (el) {
            el.pause();
            el.currentTime = 0;
            el.src = src;
        }
        dispatch({ type: "SET_SRC", payload: src });
    };

    const setPaused = (paused: boolean) => {
        const el = audioRef.current;
        if (el) {
            if (paused) {
                el.pause();
            } else {
                el.play();  
            }
        }
        dispatch({ type: "SET_PAUSED", payload: paused });
    };

    return (
        <AudioContext.Provider value={{
            audioRef,
            selectedTrackId: state.selectedTrackId,
            playbackTime: state.playbackTime,
            duration: state.duration,
            src: state.src,
            paused: state.paused,
            setSelectedTrackId,
            setTime,
            resetSong,
            setSrc,
            setPaused,
        }}>
            {children}
        </AudioContext.Provider>
    )
}

export { AudioContext, AudioProvider };