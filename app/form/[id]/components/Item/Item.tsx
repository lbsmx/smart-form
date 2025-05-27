'use client';

import React, { forwardRef, memo, useEffect, useState } from 'react';
import { InputProps } from 'antd/es/input';
import TextInput from '../form-item/text-input';
import TextArea from '../form-item/text-area';
import Handle from './components/Handle/Handle';
import styles from './Item.module.css';
import { ItemProps } from './index';
import { Button, Switch } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { FormUpdateType, updateForm } from '@/store/form';
import RadioGroup from '../form-item/radio-group';
import CheckboxGroup from '../form-item/checkbox-group';
import { CloseOutlined } from '@ant-design/icons';
import { UploaderProps } from '../form-item/upload';
import Uploader from '../form-item/upload';
import FormRate from '../form-item/form-rate';

// 定义表单组件的类型映射
export interface FormComponentMap {
    textInput: React.FC<InputProps & ItemProps>;
    textArea: React.FC<InputProps & ItemProps>;
    radioGroup: React.FC<ItemProps>;
    checkboxGroup: React.FC<ItemProps>;
    uploader: React.FC<UploaderProps>;
    rate: React.FC<ItemProps>;
}

// 实现表单组件的映射
export const formComponentMap: FormComponentMap = {
    textInput: TextInput,
    textArea: TextArea,
    radioGroup: RadioGroup,
    checkboxGroup: CheckboxGroup,
    uploader: Uploader,
    rate: FormRate,
};

const Item = forwardRef<HTMLElement, ItemProps>(
    (
        {
            sortable,
            listeners,
            attributes,
            id,
            type,
            isDragging,
            required,
            label,
            options,
        },
        ref
    ) => {
        const [isEditing, setIsEditing] = useState(false);
        const dispatch = useDispatch<AppDispatch>();
        const formList = useSelector((state: RootState) => state.form.formList);

        useEffect(() => {
            document.addEventListener('click', handleDocumentClick);
            return () => {
                document.removeEventListener('click', handleDocumentClick);
            };
        }, []);

        // 全局点击事件处理，将item变为非编辑状态
        const handleDocumentClick = (e: MouseEvent) => {
            if (!(e.target instanceof HTMLElement) || isEditing) return;
            const targetEl = e.target.closest(`.${styles.item}`);
            if (
                !targetEl ||
                targetEl?.getAttribute('data-id') !== id ||
                e.target.closest(`.${styles.switchContainer}`)
            ) {
                setIsEditing(false);
            } else {
                setIsEditing(true);
            }
        };

        const onRequiredChange = (checked: boolean) => {
            dispatch(
                updateForm({
                    type: FormUpdateType.UpdateItem,
                    data: {
                        id,
                        updated: { required: checked },
                    },
                })
            );
        };

        const handleDelete = () => {
            dispatch(
                updateForm({
                    type: FormUpdateType.DeleteItem,
                    data: {
                        index: formList.findIndex((item) => item.id === id),
                        item: formList.find((item) => item.id === id),
                    },
                })
            );
        };

        return (
            <div
                className={`${styles.item} ${
                    isDragging ? styles.dragging : ''
                }`}
                ref={ref}
                data-id={id}
                {...(!sortable ? listeners : undefined)}
                tabIndex={!sortable ? 0 : undefined}
                {...attributes}
            >
                <div className={styles.labelContainer}>
                    {!sortable || isEditing ? null : (
                        <>
                            <div className={styles.handle}>
                                <Handle listeners={listeners} />
                            </div>
                            <label
                                className={`${styles.label} ${
                                    required ? styles.required : ''
                                }`}
                            >
                                {label}
                            </label>
                            <div className={styles.switchContainer}>
                                <Switch
                                    size='small'
                                    checked={required}
                                    onChange={onRequiredChange}
                                />
                                <span className={styles.switchText}>必填</span>
                            </div>
                            <Button
                                type='text'
                                size='small'
                                icon={<CloseOutlined />}
                                style={{ marginLeft: '8px' }}
                                onClick={handleDelete}
                            />
                        </>
                    )}
                </div>
                <div
                    className={`${styles.formItemContainer} ${
                        !isEditing ? styles.editable : ''
                    }`}
                >
                    {formComponentMap[type as keyof FormComponentMap]({
                        id,
                        type,
                        isEditing,
                        sortable,
                        required,
                        label,
                        options,
                    })}
                </div>
            </div>
        );
    }
);

Item.displayName = 'Item';

export default memo(Item);
