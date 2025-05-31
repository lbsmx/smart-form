'use client';

import React from 'react';
import {
    Form,
    Input,
    Checkbox,
    Radio,
    Button,
    Upload,
    message,
    Rate,
    DatePicker,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import FieldType from '../form-item/field-types';

// Define types for form field options
interface FieldOptions {
    [key: string]: any;
}

function previewUploader(props) {
    const { accept, multiple } = props;
    return (
        <Upload.Dragger accept={accept} multiple={multiple}>
            <p className='ant-upload-drag-icon'>
                <InboxOutlined />
            </p>
            <p className='ant-upload-text'>
                <span style={{ color: '#1876ff' }}>点击/拖拽</span> 上传
            </p>
            <p className='ant-upload-hint'>支持 {accept} 格式的文件</p>
        </Upload.Dragger>
    );
}

interface PreviewFormProps {
    formList: FieldType[];
    share?: boolean;
    formId?: string;
}

export default function PreviewForm(props: PreviewFormProps) {
    const { formList, share = false, formId } = props;
    const [form] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();

    const typeToComponent: Record<string, React.ComponentType<FieldOptions>> = {
        textInput: Input,
        textArea: Input.TextArea,
        radioGroup: Radio.Group,
        checkboxGroup: Checkbox.Group,
        uploader: previewUploader,
        rate: Rate,
        datePicker: DatePicker,
    };

    const onFinish = async (values: any) => {
        const submitted = sessionStorage.getItem('submitted');
        if (!share) return;
        if (submitted === '1') {
            messageApi.info('请勿重复提交');
            return;
        }

        const formData = new FormData();

        formData.append('formId', formId!);

        // 遍历 values，区分普通字段和文件字段
        for (const key in values) {
            if (Object.prototype.hasOwnProperty.call(values, key)) {
                const value = values[key];

                if (value instanceof FileList || value instanceof File) {
                    // 如果是文件，直接 append
                    formData.append(key, values);
                } else if (
                    Array.isArray(value) &&
                    value.every((v) => v instanceof File)
                ) {
                    // 如果是多个文件组成的数组
                    value.forEach((file) => formData.append(key, file));
                } else {
                    // 普通文本字段
                    formData.append(key, value);
                }
            }
        }

        try {
            const res = await fetch('/api/submission', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('提交失败');

            messageApi.success('提交成功');
            sessionStorage.setItem('submitted', '1');
        } catch (error) {
            console.error('提交出错:', error);
        }
    };

    return (
        <>
            {contextHolder}
            <Form
                layout='vertical'
                style={{ padding: '24px', margin: '0 auto' }}
                form={form}
                onFinish={onFinish}
            >
                {formList.map((field) => {
                    const Component = typeToComponent[field.type];

                    if (!Component) return null;

                    return (
                        <Form.Item
                            key={field.id}
                            label={field.label}
                            name={field.id}
                            rules={[
                                {
                                    required: field.required,
                                    message: `${field.label}为必填项`,
                                },
                            ]}
                        >
                            <Component {...field.options} />
                        </Form.Item>
                    );
                })}

                <Form.Item>
                    <Button type='primary' htmlType='submit'>
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}
