'use client';

interface TemplateParams {
    id: string | undefined;
}

import * as React from 'react';
import styles from '@/app/template/[id]/page.module.css';
import SideFormItemPanel from './components/side-form-item-panel';
import MainFormPanel from './components/main-form-panel';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DropAnimation,
    defaultDropAnimationSideEffects,
    UniqueIdentifier,
    Announcements,
    ScreenReaderInstructions,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import Item from './components/Item';

const screenReaderInstructions: ScreenReaderInstructions = {
    draggable: `
      To pick up a sortable item, press the space bar.
      While sorting, use the arrow keys to move the item.
      Press space again to drop the item in its new position, or press escape to cancel.
    `,
};
export default function Template({ params }: { params: TemplateParams }) {
    const { id }: { id: string | undefined } = React.use(params);

    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [formList, setFormList] = useState([
        {
            id: '1',
            type: 'textInput',
        },
        {
            id: '2',
            type: 'textInput',
        },
        {
            id: '3',
            type: 'textInput',
        },
    ]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

    const dropAnimationConfig: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    const announcements: Announcements = {
        onDragStart({ active: { id } }) {},
        onDragOver({ active, over }) {},
        onDragEnd({ active, over }) {
            if (active && over && active.id !== over.id) {
                setFormList((items) => {
                    const oldIndex = items.findIndex(
                        (item) => item.id === active.id
                    );
                    const newIndex = items.findIndex(
                        (item) => item.id === over.id
                    );
                    return arrayMove(items, oldIndex, newIndex);
                });
            }
        },
        onDragCancel({ active: { id } }) {},
    };

    return (
        <DndContext
            accessibility={{
                announcements,
                screenReaderInstructions,
            }}
            sensors={sensors}
            collisionDetection={closestCenter}
        >
            <div className={styles.page}>
                <SideFormItemPanel></SideFormItemPanel>
                <MainFormPanel formList={formList}></MainFormPanel>
            </div>
            {portalRoot &&
                createPortal(
                    <DragOverlay
                        adjustScale={false}
                        dropAnimation={dropAnimationConfig}
                    >
                        {activeId != null ? <Item id={activeId} /> : null}
                    </DragOverlay>,
                    document.body
                )}
        </DndContext>
    );
}
