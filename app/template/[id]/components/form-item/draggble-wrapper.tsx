import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from './dnd-types';
import { useRef } from 'react';

interface DraggbleFormItem {
    id?: string;
    type: string;
    children: React.ReactNode;
    index?: number; // 表单库没有索引
    sortFn?: ({
        dragIndex,
        hoverIndex,
        item,
    }: {
        dragIndex: number | undefined;
        hoverIndex: number;
        item: DraggbleFormItem;
    }) => void;
}

export default function DraggableWrapper({
    id,
    type,
    children,
    index,
    sortFn,
}: DraggbleFormItem) {
    const formItemRef = useRef<HTMLDivElement | null>(null);

    // useDrag 处理拖拽时逻辑
    const [{ opacity }, drag] = useDrag(
        () => ({
            type: ItemTypes.FORM_ITEM,
            item: { id, type, index },
            collect: (monitor) => ({
                opacity: !!monitor.isDragging() ? 0 : 1,
            }),
        }),
        []
    );
    // useDrop 处理放置时逻辑
    const [{ handlerId }, drop] = useDrop({
        accept: ItemTypes.FORM_ITEM,
        // 用于从拖放监控器monitor中提取信息并绑定到当前的drop target
        collect(monitor) {
            return {
                // 自动生成的drop target id，用于性能优化
                handlerId: monitor.getHandlerId(),
            };
        },
        // 注意item指的是被拖拽的元素，而index指的是放置位置上的索引
        // hover触发的时机是target元素被悬浮，因此每一个hover函数触发都是在target元素内部
        /**
         * @param item: DraggbleFormItem
         * @param monitor: DropTargetMonitor
         */
        hover(item: DraggbleFormItem, monitor) {
            // console.log(item);
            // 在拖动过程中，如果没有目标或者目标没有索引（不是form中的目标）直接返回
            if (!formItemRef.current || index === undefined) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            // 避免自身拖拽
            if (dragIndex === hoverIndex) {
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect =
                formItemRef.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            if (!clientOffset) return;
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (
                dragIndex &&
                dragIndex < hoverIndex &&
                hoverClientY < hoverMiddleY
            ) {
                return;
            }
            // Dragging upwards
            if (
                dragIndex &&
                dragIndex > hoverIndex &&
                hoverClientY > hoverMiddleY
            ) {
                return;
            }

            // 区分两种情况
            // 1. drag target没有index
            // 2. drag target有index

            sortFn({ dragIndex, hoverIndex, item });
            // 这里手动修改drag target的index，原因很简单：
            // 在实际拖放的过程中，虽然会实时对表单进行排序
            // 但是drag target的item对自身index的变化是无感的
            // 因此需要手动更新index，以确保index是正确地实时变化
            // 通俗来说就是form item和drag item不是同一个元素，需要保持两者的同步
            item.index = hoverIndex;
        },
        drop(item: DraggbleFormItem) {
            handleDrop(item);
        },
    });

    const handleDrop = (item: DraggbleFormItem) => {
        console.log('diaoyongle');
        // 尾调用 清除拖拽对于侧边栏form item产生的副作用
        if (!item.id) {
            item.index = undefined;
        }
    };

    drag(drop(formItemRef));

    return (
        <div
            ref={formItemRef}
            data-handler-id={handlerId}
            style={{ opacity, cursor: 'grab' }}
        >
            {children}
        </div>
    );
}
