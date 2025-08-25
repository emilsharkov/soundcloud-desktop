import { useAudioContext } from "@/context/AudioContext"
import AdaptiveAudio from "../AdaptiveAudio"
import { JSX } from "react"

const MusicPlayer = (): JSX.Element => {
    const { audioRef } = useAudioContext()

    return (
        <div className="w-full">
            <AdaptiveAudio ref={audioRef} />
        </div>
    )
}

export { MusicPlayer }