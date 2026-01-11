import {
    DragEndEvent,
    KeyboardSensor,
    Modifier,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

/**
 * Generic hook for drag and drop functionality
 * @param items - Array of items to be reordered
 * @param getId - Function to extract the ID from an item (used as the sortable ID)
 * @param onReorder - Callback called when items are reordered, receives array of [id, newIndex] tuples
 */
export const useDragAndDrop = <T>(
    items: T[] | undefined,
    getId: (item: T) => number,
    onReorder: (positions: [number, number][]) => void
) => {
    const restrictToVerticalAxis: Modifier = ({ transform }) => {
        return {
            ...transform,
            x: 0,
        };
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px of movement before dragging starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || !items) return;

        const oldIndex = items.findIndex(
            item => getId(item) === Number(active.id)
        );
        const newIndex = items.findIndex(
            item => getId(item) === Number(over.id)
        );

        if (oldIndex !== newIndex) {
            const newItems = arrayMove(items, oldIndex, newIndex);
            const positions = newItems.map(
                (item, index) => [getId(item), index] as [number, number]
            );

            onReorder(positions);
        }
    };

    return {
        sensors,
        restrictToVerticalAxis,
        handleDragEnd,
    };
};
