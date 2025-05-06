'use client';

import React, { useState } from 'react';
import { Card, Tag, Typography, Space, Button } from 'antd';
import {
    FormOutlined,
    PlusOutlined,
    DownOutlined,
    UpOutlined,
} from '@ant-design/icons';
import FieldType from '@/app/form/[id]/components/form-item/field-types';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/navigation';
import styles from './template-card.module.css';

const { Text } = Typography;

interface TemplateCardProps {
    name: string;
    fields: FieldType[];
}

const MAX_VISIBLE_FIELDS = 6;

function TemplateCard({ name, fields }: TemplateCardProps) {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);

    const generateId = (fields: FieldType[]) => {
        return fields.map((field) => ({ ...field, id: uuid() }));
    };

    const handleTemplateSelect = async (fields: FieldType[]) => {
        const fullFields = generateId(fields);
        const res = await fetch('/api/form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: name, fields: fullFields }),
        });
        if (!res.ok) {
            throw new Error('Failed to create form');
        }
        const response = await res.json();
        if (response.id) {
            router.push(`/form/${response.id}`);
        } else {
            throw new Error('Failed to create form');
        }
    };

    const visibleFields = isExpanded
        ? fields
        : fields.slice(0, MAX_VISIBLE_FIELDS);
    const hasMoreFields = fields.length > MAX_VISIBLE_FIELDS;

    return (
        <Card
            className={styles.card}
            hoverable
            onClick={() => handleTemplateSelect(fields)}
        >
            <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>
                        <FormOutlined />
                        <div>{name}</div>
                    </div>
                </div>
                <div className={styles.fieldList}>
                    <Space size={[0, 8]} wrap>
                        {visibleFields.map((field, index) => (
                            <Tag key={index} color="blue">
                                {field.label}
                            </Tag>
                        ))}
                    </Space>
                    {hasMoreFields && (
                        <Button
                            type="text"
                            size="small"
                            className={styles.expandButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            icon={
                                isExpanded ? <UpOutlined /> : <DownOutlined />
                            }
                        >
                            {isExpanded
                                ? '收起'
                                : `展开 ${
                                      fields.length - MAX_VISIBLE_FIELDS
                                  } 个字段`}
                        </Button>
                    )}
                </div>
                <div className={styles.cardFooter}>
                    <Text type="secondary">{fields.length} 个字段</Text>
                    <PlusOutlined className={styles.createIcon} />
                </div>
            </div>
        </Card>
    );
}

export default TemplateCard;
