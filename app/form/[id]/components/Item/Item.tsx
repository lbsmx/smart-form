'use client';

import React, {
    forwardRef,
    memo,
    useContext,
    useEffect,
    useState,
} from 'react';
import { InputProps } from 'antd/es/input';
import TextInput from '../form-item/text-input';
import TextArea from '../form-item/text-area';
import Handle from './components/Handle/Handle';
import styles from './Item.module.css';
import FormContext from '../form-context';
import { ItemProps } from './index';
import { SortableItemProps } from '../sortable-item/sortable-item';
import { Switch } from 'antd';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { updateForm } from '@/store/form';
import RadioGroup from '../form-item/radio-group';

// 定义表单组件的类型映射
export interface FormComponentMap {
    textInput: React.FC<InputProps & SortableItemProps>;
    textArea: React.FC<InputProps & SortableItemProps>;
    radioGroup: React.FC<InputProps & SortableItemProps>;
}

// 实现表单组件的映射
export const formComponentMap = {
    textInput: TextInput,
    textArea: TextArea,
    radioGroup: RadioGroup,
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
            ...restProps
        },
        ref
    ) => {
        const [isEditing, setIsEditing] = useState(false);
        const [localRequired, setLocalRequired] = useState(required);
        const editable = useContext(FormContext);
        const dispatch = useDispatch<AppDispatch>();

        useEffect(() => {
            document.addEventListener('click', handleDocumentClick);
            return () => {
                document.removeEventListener('click', handleDocumentClick);
            };
        }, []);

        useEffect(() => {
            setLocalRequired(required);
        }, [required]);

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
            // 由于switch状态受到内部和外部双重控制，而外部状态变化是异步的
            // 因此需要先在本地修改状态防止动画出现闪烁问题
            setLocalRequired(checked);
            dispatch(
                updateForm({
                    type: 'formItem',
                    data: {
                        id,
                        updatedItem: { required: checked },
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
                {...restProps}
                {...attributes}
            >
                {sortable && !isEditing && (
                    <div className={styles.handle}>
                        <Handle listeners={listeners} />
                    </div>
                )}
                <div className={styles.labelContainer}>
                    {!sortable || isEditing ? null : (
                        <>
                            {localRequired && (
                                <span className={styles.requiredIcon}>*</span>
                            )}
                            <label className={styles.label}>{label}</label>
                            <div className={styles.switchContainer}>
                                <Switch
                                    size="small"
                                    checked={localRequired}
                                    onChange={onRequiredChange}
                                />
                            </div>
                        </>
                    )}
                </div>
                <div
                    className={`${styles.formItemContainer} ${
                        editable && !isEditing ? styles.editable : ''
                    }`}
                >
                    {formComponentMap[type as keyof FormComponentMap]({
                        id,
                        type,
                        isEditing,
                        sortable,
                        required,
                        label,
                        ...restProps,
                    })}
                </div>
            </div>
        );
    }
);

Item.displayName = 'Item';

export default memo(Item);
