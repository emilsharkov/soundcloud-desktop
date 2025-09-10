export function resizeSamples(
  samples: number[],
  numSamples: number,
  height: number
): number[] {
  if (numSamples <= 0) return [];
  if (samples.length === 0) return Array(numSamples).fill(0);

  if (numSamples === samples.length) {
    // Normalize directly
    const maxVal = Math.max(...samples, 0);
    if (maxVal === 0) return Array(numSamples).fill(0);
    return samples.map((s) => Math.floor((s / maxVal) * height));
  }

  const result: number[] = [];

  if (numSamples < samples.length) {
    // --- Downsample with Z-SCORE-PEAK per chunk ---
    // For each chunk: compute mean & std, then push the max positive z-score.
    // This emphasizes local spikes (values far above local mean).
    const chunkSize = samples.length / numSamples;
    const EPS = 1e-12;

    for (let i = 0; i < numSamples; i++) {
      let start = Math.floor(i * chunkSize);
      let end = Math.floor((i + 1) * chunkSize);

      // Ensure at least one element per chunk
      if (end <= start) end = Math.min(start + 1, samples.length);

      const n = Math.max(0, end - start);
      if (n === 0) {
        result.push(0);
        continue;
      }

      // mean
      let sum = 0;
      for (let j = start; j < end; j++) sum += samples[j];
      const mean = sum / n;

      // std (population)
      let varSum = 0;
      for (let j = start; j < end; j++) {
        const d = samples[j] - mean;
        varSum += d * d;
      }
      const std = Math.sqrt(varSum / n) || 0;

      if (std < EPS) {
        // nearly flat chunk → no standout spike
        result.push(0);
        continue;
      }

      // max positive z-score in chunk
      let maxZ = 0; // clamp negatives to 0 (we only care about positive spikes)
      for (let j = start; j < end; j++) {
        const z = (samples[j] - mean) / std;
        if (z > maxZ) maxZ = z;
      }

      result.push(maxZ);
    }
  } else {
    // --- Upsample with linear interpolation (raw values) ---
    for (let i = 0; i < numSamples; i++) {
      const pos = (i / (numSamples - 1)) * (samples.length - 1);
      const left = Math.floor(pos);
      const right = Math.min(left + 1, samples.length - 1);
      const t = pos - left;
      result.push(samples[left] * (1 - t) + samples[right] * t);
    }
  }

  // Normalize to the given height
  const maxSample = Math.max(...result, 0);
  if (maxSample === 0) return Array(numSamples).fill(0);

  const resizedSamples = result.map((s) => (
    Math.max(1, Math.floor((s / maxSample) * height))
  ));
  return resizedSamples;
}
