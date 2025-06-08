'use client';

import { useState } from 'react';
import { Button, Modal, Form, Input, Typography } from 'antd';
import {
    RocketOutlined,
    BulbOutlined,
    SendOutlined,
    RobotOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import styles from './generate-template.module.css';
import useMessage from 'antd/es/message/useMessage';
import FieldType from '@/app/form/[id]/components/form-item/field-types';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/navigation';

const { TextArea } = Input;
const { Text, Title } = Typography;

interface FormValues {
    requirements: string;
}

export default function GenerateTemplate({ disabled }: { disabled: boolean }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [form] = Form.useForm<FormValues>();
    const [messageApi, contextHolder] = useMessage();

    const router = useRouter();

    const showModal = () => {
        if (disabled) {
            messageApi.info('请先登录');
            return;
        }
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const generateId = (fields: FieldType[]) => {
        return fields.map((field) => ({ ...field, id: uuid() }));
    };

    const handleSubmit = async () => {
        form.validateFields().then(async (values) => {
            setIsGenerating(true);
            handleCancel();
            try {
                const res = await fetch('/api/ai-chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        requirements: values.requirements,
                    }),
                });
                if (!res.ok) {
                    const response = await res.json();
                    throw new Error(response.error);
                }
                const response = await res.json();
                const { formTitle, formList } = response;
                messageApi.success('模板生成成功，正在跳转至详情页');
                const fullFields = generateId(formList);
                const formRes = await fetch('/api/form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: formTitle,
                        fields: fullFields,
                    }),
                });
                if (!formRes.ok) {
                    throw new Error('创建表单失败');
                }
                const form = await formRes.json();
                if (form.id) {
                    router.push(`/form/${form.id}`);
                } else {
                    throw new Error('创建表单失败');
                }
            } catch (error: any) {
                if (error.message) {
                    messageApi.error(`生成失败，${error.message}`);
                }
            } finally {
                setIsGenerating(false);
            }
        });
    };

    return (
        <>
            {contextHolder}
            <div className={styles.promptContainer}>
                <Text className={styles.promptText}>
                    <BulbOutlined
                        style={{ fontSize: '20px', color: '#ffd43b' }}
                    />
                    找不到合适的模板？试试我们的 AI 助手
                </Text>
                <Button
                    type='primary'
                    onClick={showModal}
                    className={styles.generateButton}
                    icon={<RocketOutlined />}
                    loading={isGenerating}
                >
                    {isGenerating ? '生成中...' : '立即生成专属模板'}
                </Button>
            </div>

            <Modal
                title={null}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={600}
                className={styles.modal}
                closeIcon={null}
            >
                <div className={styles.modalContent}>
                    <div className={styles.header}>
                        <Title level={2} className={styles.title}>
                            <RobotOutlined
                                style={{ color: '#4a6cf7', fontSize: '28px' }}
                            />
                            AI 助手
                        </Title>
                        <Text className={styles.subtitle}>
                            请输入您的表单需求，AI 将为您生成专属模板
                        </Text>
                    </div>

                    <Form form={form} layout='vertical' className={styles.form}>
                        <Form.Item
                            name='requirements'
                            rules={[
                                {
                                    required: true,
                                    message: '请输入您的表单需求',
                                },
                            ]}
                            className={styles.formItem}
                        >
                            <TextArea
                                className={styles.textArea}
                                placeholder='可以是模糊需求，比如帮我生成周报模板，也可以是具体需求，比如帮我生成模板要求姓名，年龄，性别等字段'
                                autoSize={{ minRows: 6, maxRows: 12 }}
                                minLength={5}
                                maxLength={200}
                            />
                        </Form.Item>
                    </Form>

                    <div className={styles.footer}>
                        <Button
                            onClick={handleCancel}
                            className={styles.cancelButton}
                            icon={<CloseOutlined />}
                            disabled={isGenerating}
                        >
                            取消
                        </Button>
                        <Button
                            type='primary'
                            onClick={handleSubmit}
                            className={styles.submitButton}
                            icon={<SendOutlined />}
                            loading={isGenerating}
                        >
                            {isGenerating ? '生成中...' : '生成模板'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
