import { useTrackWaveform } from '@/hooks/useTrackWaveform';
import { useAudio } from '@/providers/AudioProvider';
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { FullscreenPlayerStage } from './FullscreenPlayerStage';
import { useFullscreenDrag } from './hooks/useFullscreenDrag';
import { useViewportWidth } from './hooks/useViewportWidth';

interface FullscreenPlayerProps {
    isOpen: boolean;
    onClose: () => void;
}

const FullscreenPlayer = (props: FullscreenPlayerProps): React.ReactNode => {
    const { isOpen, onClose } = props;
    const {
        trackMediaMetadata,
        playbackTime,
        duration,
        setTime,
        selectedTrackId,
    } = useAudio();
    const { artwork } = trackMediaMetadata ?? {};
    const viewportWidth = useViewportWidth();
    const {
        position,
        dragging,
        handleDragStart,
        handleDragMove,
        handleDragEnd,
    } = useFullscreenDrag({
        viewportWidth,
        duration,
        setTime,
        selectedTrackId,
    });

    const percentageCompleted = dragging
        ? position / -viewportWidth
        : duration > 0
          ? playbackTime / duration
          : 0;

    const { data: waveform, isLoading: isWaveformLoading } =
        useTrackWaveform(selectedTrackId);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    if (isWaveformLoading || waveform === undefined) {
        return null;
    }

    return (
        <>
            {isOpen ? (
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                >
                    <FullscreenPlayerStage
                        artwork={artwork}
                        onClose={onClose}
                        waveform={waveform}
                        percentageCompleted={percentageCompleted}
                        width={viewportWidth}
                    />
                </DndContext>
            ) : null}
        </>
    );
};

export { FullscreenPlayer };
