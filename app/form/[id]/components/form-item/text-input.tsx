'use client';

import { Input, InputNumber, Form } from 'antd';
import React from 'react';
import FieldType from './field-types';
import WithUpdateState from './withUpdateState';

function TextInput(props: FieldType) {
    const { isEditing, options, label, onChange } = props;
    const { placeholder } = options;

    const [form] = Form.useForm();

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
                    onChange={() => onChange(form.getFieldsValue())}
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

export default WithUpdateState(TextInput);
