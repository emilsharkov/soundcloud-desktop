// AdaptiveAudio.tsx
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
  const { src, ref, ...rest } = props;

  useAdaptiveAudio(src, ref);

  return (
    <audio
      ref={ref}
      {...rest}
    />
  );
};

export default AdaptiveAudio;
