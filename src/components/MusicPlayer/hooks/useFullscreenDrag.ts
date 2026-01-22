import { DragCancelEvent, DragEndEvent, DragMoveEvent } from '@dnd-kit/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const clampPosition = (value: number, min: number, max: number) => {
    return Math.min(max, Math.max(min, value));
};

const useFullscreenDrag = (
    viewportWidth: number,
    playbackTime: number,
    duration: number,
    setTime: (time: number) => void,
    selectedTrackId: number | null
) => {
    const [position, setPosition] = useState(0);
    const [dragging, setDragging] = useState<boolean>(false);
    const dragStartPosition = useRef(0);

    const minPosition = useMemo(() => -viewportWidth, [viewportWidth]);
    const maxPosition = 0;

    useEffect(() => {
        setPosition(current =>
            clampPosition(current, minPosition, maxPosition)
        );
    }, [minPosition, maxPosition]);

    useEffect(() => {
        setPosition(0);
    }, [selectedTrackId]);

    useEffect(() => {
        if (dragging) return;
        setPosition((playbackTime / duration) * -viewportWidth);
    }, [playbackTime, duration, viewportWidth, dragging]);

    const handleDragStart = useCallback(() => {
        dragStartPosition.current = position;
        setDragging(true);
    }, [position]);

    const handleDragMove = useCallback(
        (event: DragMoveEvent) => {
            const nextPosition = dragStartPosition.current + event.delta.x;
            setPosition(clampPosition(nextPosition, minPosition, maxPosition));
            setDragging(true);
        },
        [minPosition, maxPosition]
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const nextPosition = dragStartPosition.current + event.delta.x;
            const newPosition = clampPosition(
                nextPosition,
                minPosition,
                maxPosition
            );
            setPosition(newPosition);
            setTime(
                duration > 0 ? (newPosition / -viewportWidth) * duration : 0
            );
            setDragging(false);
        },
        [duration, maxPosition, minPosition, setTime, viewportWidth]
    );

    const handleDragCancel = useCallback((_: DragCancelEvent) => {
        setDragging(false);
    }, []);

    useEffect(() => {
        const handlePointerUp = () => {
            setDragging(false);
        };
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);
        window.addEventListener('mouseup', handlePointerUp);
        window.addEventListener('touchend', handlePointerUp);
        return () => {
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
            window.removeEventListener('mouseup', handlePointerUp);
            window.removeEventListener('touchend', handlePointerUp);
        };
    }, []);

    return {
        position,
        dragging,
        minPosition,
        maxPosition,
        handleDragStart,
        handleDragMove,
        handleDragEnd,
        handleDragCancel,
    };
};

export { useFullscreenDrag };
