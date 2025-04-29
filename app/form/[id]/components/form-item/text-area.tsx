import React from 'react';
import { Input, Form, InputNumber } from 'antd';
import { useDispatch } from 'react-redux';
import { updateForm } from '@/store/form';
import { AppDispatch } from '@/store/index';

const { TextArea } = Input;

interface TextAreaProps {
    id: string;
    placeholder?: string;
    maxLength?: number;
    isEditing: boolean;
    label: string;
}

export default function Textarea(props: TextAreaProps) {
    const { isEditing, id, placeholder, maxLength, label } = props;

    const dispatch = useDispatch<AppDispatch>();

    const [form] = Form.useForm();

    const onValuesChange = (changedValues: any) => {
        dispatch(
            updateForm({
                type: 'formItem',
                data: {
                    id,
                    updatedItem: changedValues,
                },
            })
        );
    };

    const effectiveMaxLength = maxLength ? Math.min(maxLength, 500) : 500;

    return (
        <div style={{ flex: 1 }}>
            {!isEditing && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextArea
                        rows={4}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        placeholder={placeholder}
                        maxLength={effectiveMaxLength}
                        style={{ flex: 1 }}
                    />
                </div>
            )}
            {isEditing && (
                <Form
                    layout="horizontal"
                    form={form}
                    initialValues={{ label, placeholder, maxLength }}
                    onValuesChange={onValuesChange}
                >
                    <Form.Item label="表单问题" name="label">
                        <Input placeholder="请输入标题" />
                    </Form.Item>
                    <Form.Item label="占位文本" name="placeholder">
                        <Input placeholder="请输入占位文本" />
                    </Form.Item>
                    <Form.Item label="最大长度" name="maxLength">
                        <InputNumber
                            min={1}
                            max={500}
                            placeholder="请输入文本最大长度，默认最大长度为500"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Form>
            )}
        </div>
    );
}
