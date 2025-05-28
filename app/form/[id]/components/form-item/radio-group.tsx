'use client';

import React from 'react';
import { Input, Button, Form } from 'antd';
import Handle from '../Item/components/Handle';
import {
    Announcements,
    closestCenter,
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { CloseOutlined } from '@ant-design/icons';
import styles from './radio-group.module.css';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { v4 as uuid } from 'uuid';
import FieldType from './field-types';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { FormUpdateType, updateForm } from '@/store/form';

const SortableOption = ({ option, index, onChange, onDelete }) => {
    const { value } = option;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: value });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(value, event.target.value);
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            style={style}
            className={styles.draggableRadio}
        >
            <Handle listeners={listeners} />
            <Form.Item name={['options', 'options', index, 'label']} noStyle>
                <Input className={styles.input} onChange={handleChange} />
            </Form.Item>
            <Button
                type='text'
                icon={<CloseOutlined />}
                className={styles.closeButton}
                onClick={() => onDelete(value)}
            />
        </div>
    );
};

const RenderOptions = ({ label, options, id }) => {
    const dispatch = useDispatch<AppDispatch>();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 15 },
        })
    );

    const announcements: Announcements = {
        onDragStart() {
            return undefined;
        },
        onDragOver() {
            return undefined;
        },
        onDragCancel() {
            return undefined;
        },
        onDragEnd: ({ active, over }) => {
            if (active && over && active.id !== over.id) {
                const activeIndex = options.findIndex(
                    (item) => item.value === active.id
                );
                const overIndex = options.findIndex(
                    (item) => item.value === over.id
                );
                const updatedOptions = arrayMove(
                    options,
                    activeIndex,
                    overIndex
                );
                console.log(updatedOptions);
            }
            return undefined;
        },
    };

    const handleChange = (optionId: string, newLabel: string) => {
        const updatedOptions = options.map((option) =>
            option.value === optionId
                ? {
                      ...option,
                      label: newLabel,
                  }
                : option
        );
        dispatch(
            updateForm({
                type: FormUpdateType.UpdateItem,
                data: {
                    id,
                    old: { label, options: { options } },
                    updated: {
                        label,
                        options: {
                            options: updatedOptions,
                        },
                    },
                },
            })
        );
    };

    const handleDelete = (optionId: string) => {
        const updatedOptions = options.filter(
            (option) => option.value !== optionId
        );
        dispatch(
            updateForm({
                type: FormUpdateType.UpdateItem,
                data: {
                    id,
                    old: { label, options: { options } },
                    updated: {
                        label,
                        options: {
                            options: updatedOptions,
                        },
                    },
                },
            })
        );
    };

    return (
        <DndContext
            accessibility={{ announcements }}
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
        >
            <SortableContext
                items={options.map((item) => item.value)}
                strategy={verticalListSortingStrategy}
            >
                {options.map((option, index) => (
                    <SortableOption
                        key={option.value}
                        option={option}
                        index={index}
                        onChange={handleChange}
                        onDelete={handleDelete}
                    />
                ))}
            </SortableContext>
        </DndContext>
    );
};

function RadioGroup(props: FieldType) {
    const { isEditing, options, label, id } = props;
    const [form] = Form.useForm();
    const dispatch = useDispatch<AppDispatch>();

    const handleAddOption = () => {
        const newOption = {
            value: uuid(),
            label: '新选项',
        };
        dispatch(
            updateForm({
                type: FormUpdateType.UpdateItem,
                data: {
                    id,
                    old: { label, options },
                    updated: {
                        label,
                        options: {
                            options: [...options.options, newOption],
                        },
                    },
                },
            })
        );
    };

    const onLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newLabel = event.target.value;
        dispatch(
            updateForm({
                type: FormUpdateType.UpdateItem,
                data: {
                    id,
                    old: { label, options },
                    updated: {
                        label: newLabel,
                        options,
                    },
                },
            })
        );
    };

    return (
        <div style={{ flex: 1 }}>
            {!isEditing && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Input placeholder='请选择选项' style={{ flex: 1 }} />
                </div>
            )}
            {isEditing && (
                <Form
                    layout='horizontal'
                    form={form}
                    initialValues={{
                        label,
                        options,
                    }}
                >
                    <Form.Item label='表单问题' name='label'>
                        <Input
                            placeholder='请输入标题'
                            onChange={onLabelChange}
                        />
                    </Form.Item>
                    <Form.Item label='选项内容'>
                        <Button
                            type='text'
                            onClick={handleAddOption}
                            style={{ color: 'rgb(20, 86, 240)' }}
                        >
                            + 添加选项
                        </Button>
                        <RenderOptions
                            label={label}
                            options={options.options}
                            id={id}
                        />
                    </Form.Item>
                </Form>
            )}
        </div>
    );
}

export default RadioGroup;
