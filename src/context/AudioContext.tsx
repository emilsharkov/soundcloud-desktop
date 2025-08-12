import { createContext, useContext, useRef, useState } from "react";

export interface AudioContextType {
    audioRef: React.RefObject<HTMLAudioElement | null>;
    selectedTrackId: string | null;
    setSelectedTrackId: (trackId: string | null) => void;
}

const AudioContext = createContext<AudioContextType>({
    audioRef: { current: null },
    selectedTrackId: null,
    setSelectedTrackId: () => {},
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
    const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

    return (
        <AudioContext.Provider value={{ audioRef, selectedTrackId, setSelectedTrackId }}>
            {children}
        </AudioContext.Provider>
    )
}

export { AudioContext, AudioProvider };