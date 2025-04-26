import { Input, InputNumber, Form } from 'antd';
import React from 'react';
import { SortableItemProps } from '../sortable-item/sortable-item';
import { useDispatch } from 'react-redux';
import { updateForm } from '@/store/form';
import { AppDispatch } from '@/store/index';

interface TextInputProps extends SortableItemProps {
    placeholder?: string;
    maxLength?: number;
    isEditing: boolean;
}

export default function TextInput(props: TextInputProps) {
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

    return (
        <div style={{ flex: 1 }}>
            {!isEditing && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Input
                        maxLength={props.maxLength}
                        placeholder={props.placeholder}
                        style={{ flex: 1, marginRight: 8 }}
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
                    <Form.Item label="表单标题" name="label">
                        <Input placeholder="请输入标题" />
                    </Form.Item>
                    <Form.Item label="占位文本" name="placeholder">
                        <Input placeholder="请输入占位文本" />
                    </Form.Item>
                    <Form.Item label="最大长度" name="maxLength">
                        <InputNumber
                            min={1}
                            max={1000}
                            placeholder="请输入文本最大长度，默认最大长度为30"
                        />
                    </Form.Item>
                </Form>
            )}
        </div>
    );
}
