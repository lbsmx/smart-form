'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './form-title.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { updateForm } from '@/store/form';

interface FormTitleProps {
    editable: boolean;
}

export default function FormTitle({ editable }: FormTitleProps) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const formTitle = useSelector((state: RootState) => state.form.formTitle);
    const textRef = useRef<HTMLHeadingElement | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (isEditing && textRef.current) {
            textRef.current.focus();
            document.execCommand('selectAll', false, undefined);
        }
    }, [isEditing]);

    const handleEdit = () => {
        if (!editable) return;
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (textRef.current) {
            const trimmedTitle = textRef.current.innerText.trim();
            if (trimmedTitle === '') {
                textRef.current.innerHTML = formTitle;
            } else {
                dispatch(
                    updateForm({
                        type: 'formTitle',
                        data: {
                            formTitle: trimmedTitle,
                        },
                    })
                );
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLHeadingElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // 阻止默认的换行行为
            event.target.blur();
        } else if (
            textRef.current &&
            textRef.current.innerText.length >= 30 &&
            ![
                'Backspace',
                'Delete',
                'ArrowLeft',
                'ArrowRight',
                'ArrowUp',
                'ArrowDown',
            ].includes(event.key)
        ) {
            event.preventDefault(); // 阻止输入超过30个字符
        }
    };

    return (
        <div className={styles.formTitleContainer}>
            <h1
                ref={textRef}
                contentEditable={editable && isEditing}
                onClick={handleEdit}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`${styles.formTitleText} ${
                    editable ? styles.editable : ''
                }`}
            >
                {formTitle}
            </h1>
        </div>
    );
}
