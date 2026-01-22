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
        playbackTime,
        duration,
        setTime,
        selectedTrackId,
        trackMediaMetadata,
    } = useAudio();
    const viewportWidth = useViewportWidth();
    const {
        position,
        handleDragStart,
        handleDragMove,
        handleDragEnd,
        handleDragCancel,
    } = useFullscreenDrag(
        viewportWidth,
        playbackTime,
        duration,
        setTime,
        selectedTrackId
    );

    const { data: waveform, isLoading: isWaveformLoading } =
        useTrackWaveform(selectedTrackId);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const { artwork, title, artist } = trackMediaMetadata ?? {};

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
                    onDragCancel={handleDragCancel}
                >
                    <FullscreenPlayerStage
                        title={title}
                        artist={artist}
                        artwork={artwork}
                        onClose={onClose}
                        waveform={waveform}
                        position={position}
                        width={viewportWidth}
                    />
                </DndContext>
            ) : null}
        </>
    );
};

export { FullscreenPlayer };
