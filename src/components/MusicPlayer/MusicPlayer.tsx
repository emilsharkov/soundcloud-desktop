import { useAudioContext } from "@/models/audio/AudioContext"
import AdaptiveAudio from "../AdaptiveAudio"
import { JSX } from "react"

const MusicPlayer = (): JSX.Element => {
    const { audioRef } = useAudioContext()

    return (
        <div className="w-full">
            <AdaptiveAudio loop controls ref={audioRef} />
        </div>
    )
}

export { MusicPlayer }