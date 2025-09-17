const orange = '#ff4900';
const lightOrange = '#ffa571';

const getSampleColor = (
    index: number,
    currentSample: number,
    hoveredSample: number | null,
    isCurrentTrack: boolean
): string => {
    if (!isCurrentTrack) {
        return 'white';
    }

    if (hoveredSample === null) {
        return index < currentSample ? orange : 'white';
    }

    const minSample = Math.min(currentSample, hoveredSample);
    const maxSample = Math.max(currentSample, hoveredSample);

    if (index < minSample) return orange;
    if (index < maxSample) return lightOrange;
    return 'white';
};

export { getSampleColor };
