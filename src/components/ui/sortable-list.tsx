import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ReactNode } from 'react';

interface SortableListProps<T> {
    items: T[] | undefined;
    getId: (item: T) => number;
    onReorder: (positions: [number, number][]) => void;
    children: ReactNode;
    className?: string;
    emptyMessage?: string;
}

export const SortableList = <T,>(props: SortableListProps<T>) => {
    const {
        items,
        getId,
        onReorder,
        children,
        className = 'flex flex-col gap-2',
        emptyMessage,
    } = props;

    const { sensors, restrictToVerticalAxis, handleDragEnd } = useDragAndDrop(
        items,
        getId,
        onReorder
    );

    if (!items || items.length === 0) {
        if (emptyMessage) {
            return (
                <div className='flex flex-col items-center justify-center py-12 text-tertiary'>
                    <p>{emptyMessage}</p>
                </div>
            );
        }
        return null;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
        >
            <SortableContext
                items={items.map(item => getId(item).toString())}
                strategy={verticalListSortingStrategy}
            >
                <div className={className}>{children}</div>
            </SortableContext>
        </DndContext>
    );
};
