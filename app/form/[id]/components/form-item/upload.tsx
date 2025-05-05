'use client';

import { Upload, Form, Input, Checkbox } from 'antd';
import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { updateForm } from '@/store/form';
import { AppDispatch } from '@/store/index';
import FieldType from './field-types';

const { Dragger } = Upload;

export interface UploaderProps extends FieldType {
    accept?: string;
    multiple?: boolean;
}

export default function Uploader(props: UploaderProps) {
    const { isEditing, id, label, options } = props;
    const { accept = '', multiple = false } = options;
    const dispatch = useDispatch<AppDispatch>();

    const [form] = Form.useForm();

    const onValuesChange = (changedValues: any) => {
        dispatch(
            updateForm({
                type: 'formItem',
                data: {
                    id,
                    updatedItem:
                        'accept' in changedValues
                            ? {
                                  options: {
                                      ...options,
                                      accept: changedValues.accept.join(','),
                                  },
                              }
                            : { options: { ...options, ...changedValues } },
                },
            })
        );
    };

    const fileOptions = [
        { value: 'image/*', label: '图片' },
        { value: '.pdf', label: 'PDF' },
        { value: '.docx', label: 'Word' },
        { value: '.xlsx', label: 'Excel' },
    ];

    // 保证至少有一个选项被选中
    const isCheckboxDisabled = (value: string) => {
        return (
            accept.split(',').length <= 1 && accept.split(',').includes(value)
        );
    };

    return (
        <div style={{ flex: 1 }}>
            {!isEditing && (
                <Dragger name="file">
                    <p>
                        <InboxOutlined />
                    </p>
                </Dragger>
            )}

            {isEditing && (
                <Form
                    layout="horizontal"
                    form={form}
                    initialValues={{
                        label,
                        multiple,
                        accept: accept.split(','),
                    }}
                    onValuesChange={onValuesChange}
                >
                    <Form.Item label="表单问题" name="label">
                        <Input placeholder="请输入标题" />
                    </Form.Item>
                    <Form.Item
                        label="多选上传"
                        name="multiple"
                        valuePropName="checked"
                    >
                        <Checkbox>上传多个文件</Checkbox>
                    </Form.Item>
                    <Form.Item label="支持格式" name="accept">
                        <Checkbox.Group>
                            {fileOptions.map((option) => (
                                <Checkbox
                                    key={option.value}
                                    value={option.value}
                                    disabled={isCheckboxDisabled(option.value)}
                                >
                                    {option.label}
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
}
