'use client';

import { Input, InputNumber, Form } from 'antd';
import React, { use, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FormUpdateType, updateForm } from '@/store/form';
import { AppDispatch } from '@/store/index';
import FieldType from './field-types';

export default function TextInput(props: FieldType) {
    const { isEditing, id, options, label } = props;
    const { placeholder } = options;

    const dispatch = useDispatch<AppDispatch>();

    const [form] = Form.useForm();

    const [changed, setChanged] = useState<boolean>(false);

    const [formData, setFormData] = useState(null);

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
                    old: {
                        label,
                        options,
                    },
                    updated: formData,
                },
            })
        );
    };

    const handleChange = () => {
        setFormData(form.getFieldsValue());
        setChanged(true);
    };

    return (
        <div style={{ flex: 1 }}>
            {!isEditing && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Input placeholder={placeholder} style={{ flex: 1 }} />
                </div>
            )}
            {isEditing && (
                <Form
                    layout='horizontal'
                    form={form}
                    initialValues={{ label, options }}
                    onChange={handleChange}
                >
                    <Form.Item label='表单问题' name='label'>
                        <Input placeholder='请输入标题' />
                    </Form.Item>
                    <Form.Item
                        label='占位文本'
                        name={['options', 'placeholder']}
                    >
                        <Input placeholder='请输入占位文本' />
                    </Form.Item>
                    <Form.Item label='最大长度' name={['options', 'maxLength']}>
                        <InputNumber
                            min={1}
                            max={30}
                            placeholder='请输入文本最大长度，默认最大长度为30'
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Form>
            )}
        </div>
    );
}
