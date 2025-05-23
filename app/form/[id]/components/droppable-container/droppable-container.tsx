"use client";

import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Empty } from "antd";
import { useEffect, useRef } from "react";
import SortableItem from "../sortable-item/sortable-item.tsx";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index.ts";
import styles from "./droppable-container.module.css";

export default function DroppableContainer({ formList }) {
    const editable = useSelector((state: RootState) => state.form.editable);

    const { attributes, setNodeRef, transform, transition } = useSortable({
        id: "form-container",
    });

    const rowVirtualizer = useVirtualizer({
        count: formList.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 100,
        gap: 8,
    });

    const parentRef = useRef(null);

    useEffect(() => {
        document.addEventListener("click", handleDocumentClick);
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, []);

    // 点击页面可能涉及到表单项进入编辑/非编辑状态 重新计算高度
    const handleDocumentClick = () => {
        rowVirtualizer.measure();
    };

    return (
        <div
            className="droppable-container"
            ref={setNodeRef}
            {...attributes}
            style={{
                height: "calc(100% - 75px)",
                transition,
                transform: CSS.Translate.toString(transform),
            }}
        >
            <SortableContext
                items={formList.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
            >
                {formList.length > 0 ? (
                    <div
                        ref={parentRef}
                        style={{
                            height: `100%`,
                            overflowY: "auto",
                        }}
                    >
                        <div
                            style={{
                                height: `${rowVirtualizer.getTotalSize()}px`,
                                width: "100%",
                                position: "relative",
                                padding: "16px",
                            }}
                        >
                            {rowVirtualizer
                                .getVirtualItems()
                                .map((virtualItem) => (
                                    <div
                                        key={virtualItem.key}
                                        ref={rowVirtualizer.measureElement}
                                        data-index={virtualItem.index}
                                        className={styles.virtualItem}
                                        style={{
                                            position: "absolute",
                                            top: "16px",
                                            left: "16px",
                                            width: "calc(100% - 32px)",
                                            transform: `translateY(${virtualItem.start}px)`,
                                        }}
                                    >
                                        <SortableItem
                                            {...formList[virtualItem.index]}
                                            key={formList[virtualItem.index].id}
                                            sortable={true}
                                            disabled={!editable}
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>
                ) : (
                    <Empty
                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        description="No items in the form"
                    />
                )}
            </SortableContext>
        </div>
    );
}
