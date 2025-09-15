import { Repeat } from './repeat';
import { Track } from '../response';

export type QueueSnapshot = {
    tracks: Track[];
    currentIndex: number;
    shuffled: boolean;
    repeat: Repeat;
    shuffleOrder: number[];
    selectedTrackId: string | null;
};

export class PlayerQueue {
    private tracks: Track[] = [];
    private currentIndex = -1;
    private shuffled = false;
    private repeat: Repeat = 'none';
    private shuffleOrder: number[] = [];
    private listeners = new Set<() => void>();

    /** React-friendly subscription */
    subscribe = (fn: () => void) => {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    };
    private emit() {
        for (const l of this.listeners) l();
    }

    /** Snapshot for useSyncExternalStore */
    getSnapshot = (): QueueSnapshot => ({
        tracks: this.tracks,
        currentIndex: this.currentIndex,
        shuffled: this.shuffled,
        repeat: this.repeat,
        shuffleOrder: this.shuffleOrder,
        selectedTrackId:
            this.currentIndex >= 0
                ? (this.tracks[this.currentIndex]?.id?.toString() ?? null)
                : null,
    });

    /** Helpers */
    private makeSequential(n: number) {
        return Array.from({ length: n }, (_, i) => i);
    }
    private makeShuffle(n: number) {
        const arr = this.makeSequential(n);
        for (let i = n - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    private order() {
        if (!this.shuffled) return this.makeSequential(this.tracks.length);
        if (this.shuffleOrder.length !== this.tracks.length) {
            this.shuffleOrder = this.makeShuffle(this.tracks.length);
        }
        return this.shuffleOrder;
    }

    /** Commands */
    setQueue(tracks: Track[]) {
        this.tracks = tracks ?? [];
        this.currentIndex = this.tracks.length ? 0 : -1;
        this.shuffleOrder = [];
        this.emit();
    }
    enqueue(items: Track[] | Track) {
        const add = Array.isArray(items) ? items : [items];
        this.tracks = [...this.tracks, ...add];
        this.shuffleOrder = [];
        this.emit();
    }
    enqueueNext(items: Track[] | Track) {
        const add = Array.isArray(items) ? items : [items];
        if (this.currentIndex < 0) {
            this.tracks = [...this.tracks, ...add];
            this.currentIndex = this.tracks.length ? 0 : -1;
            this.shuffleOrder = [];
            this.emit();
            return;
        }
        const insertAt = this.currentIndex + 1;
        this.tracks = [
            ...this.tracks.slice(0, insertAt),
            ...add,
            ...this.tracks.slice(insertAt),
        ];
        this.shuffleOrder = [];
        this.emit();
    }
    removeAt(index: number) {
        if (index < 0 || index >= this.tracks.length) return;
        this.tracks = this.tracks.filter((_, i) => i !== index);
        if (index < this.currentIndex) this.currentIndex -= 1;
        if (this.tracks.length === 0) this.currentIndex = -1;
        if (this.currentIndex >= this.tracks.length)
            this.currentIndex = this.tracks.length - 1;
        this.shuffleOrder = [];
        this.emit();
    }
    clear() {
        this.tracks = [];
        this.currentIndex = -1;
        this.shuffleOrder = [];
        this.emit();
    }
    setIndex(index: number) {
        const clamped = Math.max(-1, Math.min(index, this.tracks.length - 1));
        this.currentIndex = clamped;
        this.emit();
    }
    setShuffled(on: boolean) {
        this.shuffled = on;
        this.shuffleOrder = [];
        this.emit();
    }
    toggleShuffle() {
        this.setShuffled(!this.shuffled);
    }
    setRepeat(r: Repeat) {
        this.repeat = r;
        this.emit();
    }

    next() {
        const n = this.tracks.length;
        if (!n) return;
        if (this.repeat === 'song') {
            this.emit();
            return;
        }
        const ord = this.order();
        const pos = ord.indexOf(this.currentIndex);
        if (pos >= 0 && pos < ord.length - 1) {
            this.currentIndex = ord[pos + 1];
            this.emit();
            return;
        }
        if (this.repeat === 'songs') {
            this.currentIndex = ord[0];
            this.emit();
            return;
        }
        this.emit(); // none: stay
    }
    prev() {
        const n = this.tracks.length;
        if (!n) return;
        const ord = this.order();
        const pos = ord.indexOf(this.currentIndex);
        if (pos > 0) {
            this.currentIndex = ord[pos - 1];
            this.emit();
            return;
        }
        if (this.repeat === 'songs') {
            this.currentIndex = ord[ord.length - 1];
            this.emit();
            return;
        }
        this.emit();
    }

    current(): Track | null {
        return this.currentIndex >= 0
            ? (this.tracks[this.currentIndex] ?? null)
            : null;
    }
}
