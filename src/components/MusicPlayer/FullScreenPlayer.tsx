import { useTauriQuery } from '@/hooks/useTauriQuery';
import { useWaveform } from '@/hooks/useWaveform';
import { useAudio } from '@/providers/AudioProvider';
import {
    GetTrackWaveformQuery,
    GetTrackWaveformQuerySchema,
} from '@/types/schemas/query';
import { Waveform, WaveformSchema } from '@/types/schemas/response/local';
import {
    DndContext,
    DragEndEvent,
    DragMoveEvent,
    PointerSensor,
    useDraggable,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react';

interface FullScreenPlayerProps {
    isOpen: boolean;
    onClose: () => void;
}

const DraggableContainer = ({
    artwork,
    onClose,
    position,
    waveform,
}: {
    artwork?: string;
    onClose: () => void;
    position: number;
    waveform: Waveform;
}) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: 'fullscreen-player',
    });

    const style = {
        backgroundImage: `url(${artwork})`,
        width: '200vw',
        transform: `translate3d(${position}px, 0, 0)`,
    };

    const { ref, samples } = useWaveform(waveform);

    return (
        <div
            ref={setNodeRef}
            className='fixed top-0 left-0 h-full z-50 cursor-grab active:cursor-grabbing bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center'
            style={style}
            {...listeners}
            {...attributes}
            onClick={!isDragging ? onClose : undefined}
        >
            <div className='absolute left-[50vw] h-10 w-[100vw]'>
                <div
                    ref={ref}
                    className='gap-[1px] flex-1 flex flex-row items-center cursor-pointer overflow-hidden w-full'
                >
                    {samples.map((sample, index) => {
                        return (
                            <div
                                key={index}
                                className='w-[2px]'
                                style={{
                                    height: `${sample}px`,
                                    backgroundColor: 'orange',
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const FullScreenPlayer = (props: FullScreenPlayerProps): React.ReactNode => {
    const { isOpen, onClose } = props;
    const { trackMediaMetadata, selectedTrackId } = useAudio();
    const { artwork } = trackMediaMetadata ?? {};
    const [position, setPosition] = useState(0);
    const [viewportWidth, setViewportWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 0
    );
    const dragStartPosition = useRef(0);

    const { data: waveform, isLoading: isWaveformLoading } = useTauriQuery<
        GetTrackWaveformQuery,
        Waveform
    >(
        'get_track_waveform',
        { id: selectedTrackId! },
        {
            querySchema: GetTrackWaveformQuerySchema,
            responseSchema: WaveformSchema,
            enabled: selectedTrackId !== null,
        }
    );

    const minPosition = -viewportWidth;
    const maxPosition = 0;

    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setPosition(current =>
            Math.min(maxPosition, Math.max(minPosition, current))
        );
    }, [minPosition, maxPosition]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = () => {
        dragStartPosition.current = position;
    };

    const handleDragMove = (event: DragMoveEvent) => {
        const nextPosition = dragStartPosition.current + event.delta.x;
        setPosition(Math.min(maxPosition, Math.max(minPosition, nextPosition)));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const nextPosition = dragStartPosition.current + event.delta.x;
        setPosition(Math.min(maxPosition, Math.max(minPosition, nextPosition)));
    };

    if (isWaveformLoading || waveform === undefined) {
        console.log('loading waveform');
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
                    <DraggableContainer
                        artwork={artwork}
                        onClose={onClose}
                        position={position}
                        waveform={waveform}
                    />
                </DndContext>
            ) : null}
        </>
    );
};

export { FullScreenPlayer };
