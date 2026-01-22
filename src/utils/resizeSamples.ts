export function resizeSamples(
    samples: number[],
    numSamples: number,
    height: number
): number[] {
    if (!samples.length) return [];

    const spikes = extractSpikes(samples);
    const bucketSize = spikes.length / numSamples;
    const buckets: number[] = [];

    for (let i = 0; i < numSamples; i++) {
        const start = Math.floor(i * bucketSize);
        const end = Math.floor((i + 1) * bucketSize);

        let max = 0;
        for (let j = start; j < end && j < spikes.length; j++) {
            if (spikes[j] > max) max = spikes[j];
        }

        buckets.push(max);
    }

    // normalize
    const maxVal = Math.max(...buckets) || 1;

    return buckets.map(v => {
        const n = v / maxVal;

        // VERY aggressive curve (this is the key)
        const shaped = Math.pow(n, 0.25);

        return Math.max(2, Math.round(shaped * height));
    });
}
function extractSpikes(samples: number[]): number[] {
    const spikes = new Array(samples.length).fill(0);

    for (let i = 1; i < samples.length - 1; i++) {
        const prev = samples[i - 1];
        const curr = samples[i];
        const next = samples[i + 1];

        // local contrast (high-pass)
        spikes[i] = Math.abs(curr - (prev + next) / 2);
    }

    return spikes;
}
