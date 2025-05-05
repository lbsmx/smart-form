'use client';

import React from 'react';
import { Input, Button, Form } from 'antd';
import { useDispatch } from 'react-redux';
import { updateForm } from '@/store/form';
import { AppDispatch } from '@/store/index';
import Handle from '../Item/components/Handle';
import {
    Announcements,
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CloseOutlined } from '@ant-design/icons';
import styles from './radio-group.module.css';
import {
    restrictToVerticalAxis,
    restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import { v4 as uuid } from 'uuid';
import FieldType from './field-types';

function DraggableRadio({
    id,
    label,
    onDelete,
    onOptionChange,
}: {
    id: string;
    label: string;
    onDelete: () => void;
    onOptionChange: (value: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onOptionChange(e.target.value);
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            style={style}
            className={styles.draggableRadio}
        >
            <Handle listeners={listeners} />
            <Input
                value={label}
                onChange={handleInputChange}
                className={styles.input}
            />
            <Button
                type="text"
                icon={<CloseOutlined />}
                className={styles.closeButton}
                onClick={onDelete}
            />
        </div>
    );
}

export default function RadioGroup(props: FieldType) {
    const { isEditing, id, options, label } = props;
    const { options: list } = options;

    const dispatch = useDispatch<AppDispatch>();

    const [form] = Form.useForm();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 15,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const onValuesChange = (changedValues: any) => {
        dispatch(
            updateForm({
                type: 'formItem',
                data: {
                    id,
                    updatedItem: {
                        options: {
                            ...options,
                            ...changedValues,
                        },
                    },
                },
            })
        );
    };

    const handleAddOption = () => {
        const newOption = {
            value: uuid(),
            label: '新选项',
        };
        const updatedList = [...list, newOption];
        dispatch(
            updateForm({
                type: 'formItem',
                data: {
                    id,
                    updatedItem: {
                        options: {
                            ...options,
                            list: updatedList,
                        },
                    },
                },
            })
        );
    };

    const handleDeleteOption = (optionId: string) => {
        const updatedList = list.filter((item) => item.value !== optionId);
        dispatch(
            updateForm({
                type: 'formItem',
                data: {
                    id,
                    updatedItem: {
                        options: {
                            ...options,
                            list: updatedList,
                        },
                    },
                },
            })
        );
    };

    const handleOptionChange = (optionId: string, value: string) => {
        const updatedList = list.map((item) =>
            item.value === optionId ? { ...item, label: value } : item
        );
        dispatch(
            updateForm({
                type: 'formItem',
                data: {
                    id,
                    updatedItem: {
                        options: {
                            ...options,
                            list: updatedList,
                        },
                    },
                },
            })
        );
    };

    const announcements: Announcements = {
        onDragStart: () => {
            return undefined;
        },
        onDragOver: () => {
            return undefined;
        },
        onDragEnd: ({ active, over }) => {
            if (active && over && active.id !== over.id) {
                const activeIndex = list.findIndex(
                    (item) => item.value === active.id
                );
                const overIndex = list.findIndex(
                    (item) => item.value === over.id
                );
                const updatedList = arrayMove(list, activeIndex, overIndex);
                dispatch(
                    updateForm({
                        type: 'formItem',
                        data: {
                            id,
                            updatedItem: {
                                options: {
                                    ...options,
                                    list: updatedList,
                                },
                            },
                        },
                    })
                );
            }
            return undefined;
        },
        onDragCancel: () => {
            return undefined;
        },
    };

    const renderOptions = () => {
        return (
            <>
                <DndContext
                    accessibility={{
                        announcements,
                    }}
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
                >
                    <SortableContext
                        items={list.map((item) => item.value)}
                        strategy={verticalListSortingStrategy}
                    >
                        {list.map((option, index) => (
                            <DraggableRadio
                                key={option.value}
                                id={option.value}
                                label={option.label}
                                onDelete={() =>
                                    handleDeleteOption(option.value)
                                }
                                onOptionChange={(value: string) =>
                                    handleOptionChange(option.value, value)
                                }
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </>
        );
    };

    return (
        <div style={{ flex: 1 }}>
            {!isEditing && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Input placeholder="请选择选项" style={{ flex: 1 }} />
                </div>
            )}
            {isEditing && (
                <Form
                    layout="horizontal"
                    form={form}
                    initialValues={{ label }}
                    onValuesChange={onValuesChange}
                >
                    <Form.Item label="表单问题" name="label">
                        <Input placeholder="请输入标题" />
                    </Form.Item>
                    <Form.Item label="选项内容">
                        <Button
                            type="text"
                            onClick={handleAddOption}
                            style={{ color: 'rgb(20, 86, 240)' }}
                        >
                            + 添加选项
                        </Button>
                        {renderOptions()}
                    </Form.Item>
                </Form>
            )}
        </div>
    );
}
