import { canPlayNativeHls, isHlsUrl } from '@/lib/hls';
import Hls from 'hls.js';

export type TransportSnapshot = {
    playbackTime: number;
    duration: number;
    src: string;
    paused: boolean;
    volume: number;
    rate: number;
};

export class AudioTransport {
    private el: HTMLAudioElement | null = null;
    private listeners = new Set<() => void>();
    private endedHandler: (() => void) | null = null;

    private playbackTime = 0;
    private duration = 0;
    private src = '';
    private paused = true;
    private volume = 1;
    private rate = 1;

    // HLS management
    private hls: Hls | null = null;

    /** React-friendly subscription */
    subscribe = (fn: () => void) => {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    };
    private emit() {
        for (const l of this.listeners) l();
    }

    getSnapshot = (): TransportSnapshot => ({
        playbackTime: this.playbackTime,
        duration: this.duration,
        src: this.src,
        paused: this.paused,
        volume: this.volume,
        rate: this.rate,
    });

    /** Allow provider/engine to hook queue policy on track end */
    setEndedHandler = (fn: (() => void) | null) => {
        this.endedHandler = fn;
    };

    /** Attach/detach an actual <audio> element */
    attach = (el: HTMLAudioElement | null) => {
        // Tear down listeners + HLS from prior element
        this.detachFromCurrentElement();

        this.el = el;

        if (this.el) {
            // Sync initial observable state from element
            this.playbackTime = this.el.currentTime ?? 0;
            this.duration = Number.isFinite(this.el.duration)
                ? this.el.duration
                : 0;
            this.paused = this.el.paused ?? true;
            this.volume = this.el.volume ?? 1;
            this.rate = this.el.playbackRate ?? 1;

            // Wire up element events
            this.el.addEventListener('timeupdate', this.onTimeUpdate);
            this.el.addEventListener('durationchange', this.onDurationChange);
            this.el.addEventListener('play', this.onPlay);
            this.el.addEventListener('pause', this.onPause);
            this.el.addEventListener('ended', this.onEnded);

            // If we already have a src set, (re)initialize playback pipeline for it
            if (this.src) {
                this.initSource(this.src);
            }
        } else {
            // No element = no live playback, but keep last-known state
            this.destroyHls();
        }

        this.emit();
    };

    // ---- Event handlers ----
    private onTimeUpdate = () => {
        if (!this.el) return;
        this.playbackTime = this.el.currentTime;
        this.emit();
    };
    private onDurationChange = () => {
        if (!this.el) return;
        this.duration = Number.isFinite(this.el.duration)
            ? this.el.duration
            : 0;
        this.emit();
    };
    private onPlay = () => {
        this.paused = false;
        this.emit();
    };
    private onPause = () => {
        this.paused = true;
        this.emit();
    };
    private onEnded = () => {
        if (this.endedHandler) this.endedHandler();
    };

    // ---- Internal: element + HLS cleanup helpers ----
    private detachFromCurrentElement() {
        if (this.el) {
            this.el.removeEventListener('timeupdate', this.onTimeUpdate);
            this.el.removeEventListener(
                'durationchange',
                this.onDurationChange
            );
            this.el.removeEventListener('play', this.onPlay);
            this.el.removeEventListener('pause', this.onPause);
            this.el.removeEventListener('ended', this.onEnded);
        }
        this.destroyHls();

        if (this.el) {
            // Release native src to free memory
            this.el.removeAttribute('src');
            this.el.load?.();
        }
    }

    private destroyHls() {
        if (this.hls) {
            try {
                this.hls.destroy();
            } catch {
                /* ignore */
            }
            this.hls = null;
        }
    }

    // ---- Internal: initialize current src on the attached element ----
    private initSource = (src: string) => {
        if (!this.el) return;

        // Always reset element first
        this.el.pause();
        this.el.currentTime = 0;

        // Clean up any previous pipeline
        this.destroyHls();

        const wantsHls = isHlsUrl(src);

        if (wantsHls && canPlayNativeHls()) {
            // Use native playback for HLS-capable browsers (Safari, iOS)
            this.el.src = src;
            this.el.load?.();
            return;
        }

        if (wantsHls && Hls.isSupported()) {
            // Use hls.js for MSE-capable browsers
            this.hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90,
            });

            this.hls.attachMedia(this.el);
            this.hls.on(Hls.Events.MEDIA_ATTACHED, () =>
                this.hls?.loadSource(src)
            );

            this.hls.on(Hls.Events.ERROR, (_evt, data) => {
                if (!data.fatal) return;
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        this.hls?.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        this.hls?.recoverMediaError();
                        break;
                    default:
                        // Unrecoverable: fall back to native detach
                        this.destroyHls();
                        this.el?.removeAttribute('src');
                        this.el?.load?.();
                }
            });

            return;
        }

        // Fallback (non-HLS, or HLS but neither native nor hls.js supported)
        this.el.src = src;
        this.el.load?.();
    };

    // ---- Commands ----
    setSrc = (src: string) => {
        // Update internal state first (useful even if no element yet)
        this.src = src;

        if (!this.el) {
            // No element attached yet; pipeline will be set up in attach()
            this.emit();
            return;
        }

        // Initialize pipeline for new src
        this.initSource(src);
        this.emit();
    };

    setPaused = async (paused: boolean) => {
        if (!this.el) {
            this.paused = paused;
            this.emit();
            return;
        }
        if (paused) this.el.pause();
        else {
            try {
                await this.el.play();
            } catch {
                /* autoplay may fail */
            }
        }
        // play/pause events will update state
    };

    setTime = (time: number) => {
        const clamped = Math.max(0, Math.min(time, this.duration || 0));
        if (this.el) this.el.currentTime = clamped;
        this.playbackTime = clamped;
        this.emit();
    };

    reset = () => {
        if (this.el) {
            this.el.pause();
            this.el.currentTime = 0;
            // Release element media pipeline completely
            this.destroyHls();
            this.el.removeAttribute('src');
            this.el.load?.();
        }
        this.playbackTime = 0;
        this.paused = true;
        this.src = '';
        this.emit();
    };

    setVolume = (v: number) => {
        const vol = Math.max(0, Math.min(v, 1));
        if (this.el) this.el.volume = vol;
        this.volume = vol;
        this.emit();
    };

    setRate = (r: number) => {
        const rate = Math.max(0.5, Math.min(r, 4));
        if (this.el) this.el.playbackRate = rate;
        this.rate = rate;
        this.emit();
    };
}
