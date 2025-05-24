'use client';

import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function DroppableContainer(props) {
    const { attributes, setNodeRef, transform, transition } = useSortable({
        id: 'form-container',
    });

    return (
        <div
            className='droppable-container'
            ref={setNodeRef}
            {...attributes}
            style={{
                transition,
                transform: CSS.Translate.toString(transform),
            }}
        >
            <SortableContext
                items={[...props.formList.map((item) => item.id)]}
                strategy={verticalListSortingStrategy}
            >
                {props.children}
            </SortableContext>
        </div>
    );
}
