// AdaptiveAudio.tsx
import { useAudioContext } from "@/context/AudioContext";
import useAdaptiveAudio from "@/hooks/useAdaptiveAudio";
import React from "react";

interface AdaptiveAudioProps extends React.DetailedHTMLProps<React.AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement> {
  ref: React.RefObject<HTMLAudioElement | null>;
}

/**
 * AdaptiveAudio
 * - Plays HLS (.m3u8) via native support (Safari/iOS) or hls.js where needed
 * - Plays MP3 (and other browser-supported formats) natively
 * - Can try fallback sources on fatal errors
    */
export const AdaptiveAudio = (props: AdaptiveAudioProps) => {
  const { ref, ...rest } = props;
  const { src } = useAudioContext();

  useAdaptiveAudio(src, ref);

  return (
    <audio
      {...rest}
      ref={ref}
      src={src}
    />
  );
};

export default AdaptiveAudio;
