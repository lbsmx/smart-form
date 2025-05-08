'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import Item from '../Item/Item.tsx';
import { SortableItemProps } from './sortable-item';
import SideItem from '../side-item';

export default function SortableItem(props: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props.id, data: props });
    const style: React.CSSProperties = {
        transition: [transition].filter(Boolean).join(', '),
        transform: transform
            ? `translate(${Math.round(transform.x)}px, ${Math.round(
                  transform.y
              )}px)`
            : undefined,
        cursor: props.sortable ? 'poiner' : 'grab',
    };

    return props.sortable ? (
        <Item
            ref={props.disabled ? undefined : setNodeRef}
            {...props}
            style={style}
            attributes={attributes}
            listeners={listeners}
            isDragging={isDragging}
        ></Item>
    ) : (
        <SideItem
            ref={props.disabled ? undefined : setNodeRef}
            {...props}
            style={style}
            attributes={attributes}
            listeners={listeners}
        />
    );
}
