import { canPlayNativeHls, isHlsUrl } from "@/lib/hls";
import Hls from "hls.js";
import { useEffect, useMemo } from "react";

const useAdaptiveAudio = (src: string | undefined, ref: React.RefObject<HTMLAudioElement | null>) => {
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
}

export default useAdaptiveAudio;