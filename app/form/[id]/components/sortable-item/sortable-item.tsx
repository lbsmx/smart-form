'use client';

import React, { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import Item from '../Item/Item.tsx';
import { SortableItemProps } from './sortable-item';
import SideItem from '../side-item';

function SortableItem(props: SortableItemProps) {
    // useSortable会导致组件更新一次
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props.id, data: props });

    const style: React.CSSProperties = {
        transition: [transition].filter(Boolean).join(','),
        transform: transform
            ? `translate(${Math.round(transform.x)}px, ${Math.round(
                  transform.y
              )}px)`
            : undefined,
        cursor: props.sortable ? 'poiner' : 'grab',
    };

    return props.sortable ? (
        // 将style绑定到父元素上并在Item内部添加memo防止组件在拖拽时频繁更新导致卡顿
        <div style={style}>
            <Item
                ref={props.disabled ? undefined : setNodeRef}
                {...props}
                attributes={attributes}
                listeners={listeners}
                isDragging={isDragging}
            ></Item>
        </div>
    ) : (
        <div style={style}>
            <SideItem
                ref={props.disabled ? undefined : setNodeRef}
                {...props}
                attributes={attributes}
                listeners={listeners}
            />
        </div>
    );
}

export default memo(SortableItem);
