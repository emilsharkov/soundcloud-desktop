import { DragEndEvent, DragMoveEvent } from '@dnd-kit/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const clampPosition = (value: number, min: number, max: number) => {
    return Math.min(max, Math.max(min, value));
};

const useFullscreenDrag = ({
    viewportWidth,
    duration,
    setTime,
    selectedTrackId,
}: {
    viewportWidth: number;
    duration: number;
    setTime: (time: number) => void;
    selectedTrackId: number | null;
}) => {
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

    return {
        position,
        dragging,
        minPosition,
        maxPosition,
        handleDragStart,
        handleDragMove,
        handleDragEnd,
    };
};

export { useFullscreenDrag };
