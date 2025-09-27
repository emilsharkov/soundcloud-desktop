import { Repeat } from './repeat';

export type QueueSnapshot = {
    trackIds: number[];
    currentIndex: number;
    shuffled: boolean;
    repeat: Repeat;
    shuffleOrder: number[];
    selectedTrackId: number | null;
};

export class PlayerQueue {
    private trackIds: number[] = [];
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
        trackIds: this.trackIds,
        currentIndex: this.currentIndex,
        shuffled: this.shuffled,
        repeat: this.repeat,
        shuffleOrder: this.shuffleOrder,
        selectedTrackId: this.currentId(),
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
        if (!this.shuffled) return this.makeSequential(this.trackIds.length);
        if (this.shuffleOrder.length !== this.trackIds.length) {
            this.shuffleOrder = this.makeShuffle(this.trackIds.length);
        }
        return this.shuffleOrder;
    }

    /** Commands */
    setQueue(trackIds: number[]) {
        this.trackIds = trackIds ?? [];
        this.currentIndex = this.trackIds.length ? 0 : -1;
        this.shuffleOrder = [];
        this.emit();
    }
    enqueue(items: number[] | number) {
        const add = Array.isArray(items) ? items : [items];
        this.trackIds = [...this.trackIds, ...add];
        this.shuffleOrder = [];
        this.emit();
    }
    enqueueNext(items: number[] | number) {
        const add = Array.isArray(items) ? items : [items];
        if (this.currentIndex < 0) {
            this.trackIds = [...this.trackIds, ...add];
            this.currentIndex = this.trackIds.length ? 0 : -1;
            this.shuffleOrder = [];
            this.emit();
            return;
        }
        const insertAt = this.currentIndex + 1;
        this.trackIds = [
            ...this.trackIds.slice(0, insertAt),
            ...add,
            ...this.trackIds.slice(insertAt),
        ];
        this.shuffleOrder = [];
        this.emit();
    }
    removeAt(index: number) {
        if (index < 0 || index >= this.trackIds.length) return;
        this.trackIds = this.trackIds.filter((_, i) => i !== index);
        if (index < this.currentIndex) this.currentIndex -= 1;
        if (this.trackIds.length === 0) this.currentIndex = -1;
        if (this.currentIndex >= this.trackIds.length)
            this.currentIndex = this.trackIds.length - 1;
        this.shuffleOrder = [];
        this.emit();
    }
    clear() {
        this.trackIds = [];
        this.currentIndex = -1;
        this.shuffleOrder = [];
        this.emit();
    }
    setIndex(index: number) {
        const clamped = Math.max(-1, Math.min(index, this.trackIds.length - 1));
        this.currentIndex = clamped;
        this.emit();
    }
    setShuffled(on: boolean) {
        this.shuffled = on;
        this.shuffleOrder = [];
        this.emit();
    }
    toggleShuffle() {
        console.log(
            'PlayerQueue.toggleShuffle called, current shuffled:',
            this.shuffled
        );
        this.setShuffled(!this.shuffled);
        console.log(
            'PlayerQueue.toggleShuffle completed, new shuffled:',
            this.shuffled
        );
    }
    setRepeat(r: Repeat) {
        console.log(
            'PlayerQueue.setRepeat called, current repeat:',
            this.repeat,
            'new repeat:',
            r
        );
        this.repeat = r;
        this.emit();
        console.log(
            'PlayerQueue.setRepeat completed, new repeat:',
            this.repeat
        );
    }

    next() {
        const n = this.trackIds.length;
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
        const n = this.trackIds.length;
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

    currentId(): number | null {
        return this.currentIndex >= 0
            ? (this.trackIds[this.currentIndex] ?? null)
            : null;
    }
}
