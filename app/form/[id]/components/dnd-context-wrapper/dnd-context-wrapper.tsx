'use client';

import * as React from 'react';
import styles from '@/app/form/[id]/page.module.css';
import SideFormItemPanel from '../../components/side-form-item-panel';
import MainFormPanel from '../../components/main-form-panel';
import {
    DndContext,
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
    rectIntersection,
} from '@dnd-kit/core';
import {
    sortableKeyboardCoordinates,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import Item from '../../components/Item/Item.tsx';
import { SortableItemProps } from '../../components/sortable-item/sortable-item';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { FormUpdateType, setForm, updateForm } from '@/store/form.ts';
import { AppDispatch, RootState } from '@/store/index.ts';
import SideItem from '../../components/side-item/side-item.tsx';
import _ from 'lodash';
import { setFormLib } from '@/store/field.ts';

const screenReaderInstructions: ScreenReaderInstructions = {
    draggable: `
      To pick up a sortable item, press the space bar.
      While sorting, use the arrow keys to move the item.
      Press space again to drop the item in its new position, or press escape to cancel.
    `,
};
export default function DndContextWrapper(props: DndContextWrapper) {
    const { formData } = props;
    const {
        id,
        formList: initFormList,
        title,
        formLib: initFormLib,
    } = formData;

    const [activeItem, setActiveItem] = useState<SortableItemProps | null>(
        null
    );
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            // 触发拖拽的阈值，默认为15px 防止绑定其上的click无法触发
            activationConstraint: {
                distance: 15,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const dispatch = useDispatch<AppDispatch>();
    const formList = useSelector((state: RootState) => state.form.formList);
    const formLib = useSelector((state: RootState) => state.field.formLib);

    // 因为在服务端无法获取document 因此组件挂载时创建 portalRoot
    useEffect(() => {
        // 客户端组件也会在服务端进行预渲染，然后在客户端进行水合，最后根据交互在客户端进行渲染
        // 因此在服务端预渲染时拿不到document，需要使用副作用函数保证在客户端获取到document
        if (typeof document !== 'undefined') setPortalRoot(document.body);
        dispatch(
            setForm({
                formId: id,
                formTitle: title,
                formList: initFormList,
            })
        );
        dispatch(setFormLib(initFormLib));
    }, []);

    const dropAnimationConfig: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    const findContainer = (id: UniqueIdentifier) => {
        if (formList.find((item) => item.id === id)) {
            return 'formList';
        }
        if (id === 'form-container') {
            return 'formContainer';
        }
        return 'formItemLib';
    };

    const announcements: Announcements = {
        onDragStart({ active }) {
            // 防止（点击）拖拽到form-container时，触发onDragStart
            if (active.id === 'form-container') return;
            setActiveItem(active.data.current as SortableItemProps);
            return undefined;
        },
        onDragOver({ active, over }) {
            if (!active || !over || !activeItem) return;

            const activeContainer = findContainer(activeItem!.id);
            const overContainer = findContainer(over.id);
            if (activeContainer === overContainer) return;
            const overItem = over.data.current;
            // 从lib中拖拽到form中
            if (activeContainer === 'formItemLib' && !activeItem?.sortable) {
                const overIndex = formList.findIndex(
                    (item) => item.id === overItem?.id
                );
                const isBelowOverItem =
                    active.rect.current.translated &&
                    active.rect.current.translated.top >
                        over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;
                const newIndex: number =
                    overIndex >= 0 ? overIndex + modifier : formList.length + 1;
                setFormItemLib((item) => {
                    if (!item) return;

                    const copyItem = _.cloneDeep(item);
                    const activeGroupKey = Object.keys(copyItem).find((key) =>
                        copyItem[key as keyof typeof copyItem]?.some(
                            (item) => item.id === activeItem.id
                        )
                    );

                    if (!activeGroupKey) return;

                    const activeGroup =
                        copyItem[activeGroupKey as keyof typeof copyItem];
                    const activeIndex = activeGroup?.findIndex(
                        (item: SortableItemProps) => item.id === activeItem.id
                    );

                    if (activeIndex === -1 || !activeGroup) return;

                    // 修改 id
                    activeGroup[activeIndex].id = uuidv4();

                    return copyItem;
                });
                dispatch(
                    updateForm({
                        type: FormUpdateType.AddItem,
                        data: {
                            index: newIndex,
                            newItem: activeItem,
                        },
                    })
                );
            }
            return undefined;
        },
        onDragEnd({ active, over }) {
            // formList排序
            if (active && over && active.id !== over.id) {
                const oldIndex = formList.findIndex(
                    (item) => item.id === active.id
                );
                const newIndex = formList.findIndex(
                    (item) => item.id === over.id
                );
                dispatch(
                    updateForm({
                        type: FormUpdateType.SortList,
                        data: {
                            oldIndex,
                            newIndex,
                        },
                    })
                );
                return;
            }

            // 批量更新机制，同一个事件处理函数中，多个setState会被合并为一次重新渲染
            setActiveItem(null);
            return undefined;
        },
        onDragCancel() {
            return undefined;
        },
    };

    // 注： 因为侧边栏和主区域共享SortableContext，因此碰撞算法不能使用closestCenter，
    // 否则会在拖拽开始就检测到侧边栏item碰撞到了form item

    return (
        <DndContext
            id='dnd-context'
            accessibility={{
                announcements,
                screenReaderInstructions,
            }}
            sensors={sensors}
            collisionDetection={rectIntersection}
        >
            <SortableContext items={[]} strategy={verticalListSortingStrategy}>
                <div className={styles.page}>
                    <SideFormItemPanel
                        formLib={formLib}
                        active={activeItem}
                    ></SideFormItemPanel>
                    <MainFormPanel formList={formList}></MainFormPanel>
                </div>
            </SortableContext>
            {portalRoot &&
                createPortal(
                    <DragOverlay
                        adjustScale={false}
                        dropAnimation={dropAnimationConfig}
                    >
                        {activeItem != null ? (
                            activeItem.sortable ? (
                                <Item
                                    {...activeItem}
                                    style={{ width: '100%' }}
                                />
                            ) : (
                                <SideItem {...activeItem} />
                            )
                        ) : null}
                    </DragOverlay>,
                    document.body
                )}
        </DndContext>
    );
}
