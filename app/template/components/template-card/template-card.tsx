'use client';

import React from 'react';
import styles from './template-card.module.css';
import FieldType from '@/app/form/[id]/components/form-item/field-types';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/navigation';

function TemplateCard({ name, fields }) {
    const router = useRouter();
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

    return (
        <div
            className={styles.card}
            onClick={() => handleTemplateSelect(fields)}
        >
            <h3 className={styles.cardTitle}>{name}</h3>
            <ul className={styles.fieldList}>
                {fields.map((field, index) => (
                    <li key={index} className={styles.fieldLabel}>
                        <span className={styles.fieldLabelText}>
                            {field.label}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TemplateCard;
