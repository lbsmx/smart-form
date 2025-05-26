'use client';

import React, { useEffect, useState } from 'react';
import { Input, Button, Form } from 'antd';
import { useDispatch } from 'react-redux';
import { updateForm, FormUpdateType } from '@/store/form';
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
import { CSS } from '@dnd-kit/utilities';
import { CloseOutlined } from '@ant-design/icons';
import styles from './radio-group.module.css';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { v4 as uuid } from 'uuid';
import FieldType from './field-types';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

// 👇 将原本写在 map 里的组件提取为一个独立的函数组件
const SortableOption = ({
    option,
    index,
    currentList,
    form,
    handleChange,
    handleDeleteOption,
}) => {
    const { value, label } = option;

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

    return (
        <Form.Item
            key={value}
            name={['options', 'list', index, 'label']}
            noStyle
        >
            <div
                ref={setNodeRef}
                {...attributes}
                style={style}
                className={styles.draggableRadio}
            >
                <Handle listeners={listeners} />
                <Input
                    value={label}
                    onChange={(e) => {
                        const updatedList = [...currentList];
                        updatedList[index].label = e.target.value;
                        form.setFieldsValue({
                            options: {
                                ...form.getFieldValue('options'),
                                list: updatedList,
                            },
                        });
                        handleChange();
                    }}
                    className={styles.input}
                />
                <Button
                    type='text'
                    icon={<CloseOutlined />}
                    className={styles.closeButton}
                    onClick={() => handleDeleteOption(value)}
                />
            </div>
        </Form.Item>
    );
};

export default function RadioGroup(props: FieldType) {
    const { isEditing, id, options, label } = props;
    const { list } = options;

    const dispatch = useDispatch<AppDispatch>();
    const [form] = Form.useForm();
    const [changed, setChanged] = useState(false);
    const [formData, setFormData] = useState(null);

    // 👇 将 sensor 提到顶层定义，确保只在组件顶层调用
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 15 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // 仅在退出编辑且有变更时更新
    useEffect(() => {
        if (!isEditing && changed) {
            handleUpdate();
            setChanged(false);
        }
    }, [isEditing, changed]);

    const handleUpdate = () => {
        dispatch(
            updateForm({
                type: FormUpdateType.UpdateItem,
                data: {
                    id,
                    updated: formData,
                },
            })
        );
    };

    const handleChange = () => {
        setFormData(form.getFieldsValue());
        setChanged(true);
    };

    const handleAddOption = () => {
        const newOption = {
            value: uuid(),
            label: '新选项',
        };
        const currentList = form.getFieldValue(['options', 'list']) || [];
        const updatedList = [...currentList, newOption];
        form.setFieldsValue({
            options: {
                ...form.getFieldValue('options'),
                list: updatedList,
            },
        });
        handleChange();
    };

    const handleDeleteOption = (optionId: string) => {
        const currentList = form.getFieldValue(['options', 'list']) || [];
        const updatedList = currentList.filter(
            (item) => item.value !== optionId
        );
        form.setFieldsValue({
            options: {
                ...form.getFieldValue('options'),
                list: updatedList,
            },
        });
        handleChange();
    };

    const RenderOptions = () => {
        const currentList = form.getFieldValue(['options', 'list']) || [];

        const announcements: Announcements = {
            onDragEnd: ({ active, over }) => {
                if (active && over && active.id !== over.id) {
                    const activeIndex = currentList.findIndex(
                        (item) => item.value === active.id
                    );
                    const overIndex = currentList.findIndex(
                        (item) => item.value === over.id
                    );
                    const updatedList = arrayMove(
                        currentList,
                        activeIndex,
                        overIndex
                    );
                    form.setFieldsValue({
                        options: {
                            ...form.getFieldValue('options'),
                            list: updatedList,
                        },
                    });
                    handleChange();
                }
            },
        };

        return (
            <DndContext
                accessibility={{ announcements }}
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext
                    items={currentList.map((item) => item.value)}
                    strategy={verticalListSortingStrategy}
                >
                    {currentList.map((option, index) => (
                        <SortableOption
                            key={option.value}
                            option={option}
                            index={index}
                            currentList={currentList}
                            form={form}
                            handleChange={handleChange}
                            handleDeleteOption={handleDeleteOption}
                        />
                    ))}
                </SortableContext>
            </DndContext>
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
                        options: {
                            list,
                        },
                    }}
                    onChange={handleChange}
                >
                    <Form.Item label='表单问题' name='label'>
                        <Input placeholder='请输入标题' />
                    </Form.Item>
                    <Form.Item label='选项内容'>
                        <Button
                            type='text'
                            onClick={handleAddOption}
                            style={{ color: 'rgb(20, 86, 240)' }}
                        >
                            + 添加选项
                        </Button>
                        <RenderOptions />
                    </Form.Item>
                </Form>
            )}
        </div>
    );
}
