// AdaptiveAudio.tsx
import React, { AudioHTMLAttributes, useEffect, useMemo, useRef } from "react";
import Hls from "hls.js";


const isHlsUrl = (url?: string) => !!url && /\.m3u8($|\?)/i.test(url);

const canPlayNativeHls = () => {
  if (typeof document === "undefined") return false;
  const a = document.createElement("audio");
  return (
    a.canPlayType("application/vnd.apple.mpegurl") !== "" ||
    a.canPlayType("audio/mpegurl") !== ""
  );
};

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

  const activeIsHls = useMemo(() => isHlsUrl(src), [src]);
  const nativeHls = useMemo(() => canPlayNativeHls(), []);


  useEffect(() => {
    const audio = ref?.current;
    if (!audio || !src) return;

    let hls: Hls | null = null;

    const cleanup = () => {
      if (hls) {
        hls.destroy();
        hls = null;
      }
      // release native src to free memory
      audio.removeAttribute("src");
      audio.load?.();
    };

    if (activeIsHls) {
      if (nativeHls) {
        audio.src = src;
        audio.load?.();
        return () => {
          cleanup();
        };
      }

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });

        hls.attachMedia(audio);
        hls.on(Hls.Events.MEDIA_ATTACHED, () => hls?.loadSource(src));

        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (!data.fatal) return;
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              cleanup();
          }
        });


        return () => {
          cleanup();
        };
      }

      return () => {
        cleanup();
      };
    } else {
      audio.src = src;
      audio.load?.();

      return () => {
        cleanup();
      };
    }
  }, [src, activeIsHls, nativeHls]);

  return (
    <audio
      ref={ref}
      {...rest}
    />
  );
};

export default AdaptiveAudio;
