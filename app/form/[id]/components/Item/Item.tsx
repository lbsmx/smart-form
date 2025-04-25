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
import NumberInput from '../form-item/number-input';
import Textarea from '../form-item/textarea';
import Handle from './components/Handle/Handle';
import styles from './Item.module.css';
import FormContext from '../form-context';
import { ItemProps } from './index';
import { SortableItemProps } from '../sortable-item/sortable-item';

// 定义表单组件的类型映射
export interface FormComponentMap {
    textInput: React.FC<InputProps & SortableItemProps>;
    numberInput: React.FC<InputProps & SortableItemProps>;
    textarea: React.FC<InputProps & SortableItemProps>;
}

// 实现表单组件的映射
export const formComponentMap = {
    textInput: TextInput,
    numberInput: NumberInput,
    textarea: Textarea,
};

const Item = forwardRef<HTMLElement, ItemProps>(
    (
        { sortable, listeners, attributes, id, type, isDragging, ...restProps },
        ref
    ) => {
        const [isEditing, setIsEditing] = useState(false);
        const editable = useContext(FormContext);

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
            if (!targetEl || targetEl?.getAttribute('data-id') !== id) {
                setIsEditing(false);
            } else {
                setIsEditing(true);
            }
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
                <div style={{ flex: 1, marginBottom: 0 }}>
                    {!sortable || isEditing ? null : (
                        <div style={{ marginBottom: 8 }}>
                            <label style={{ cursor: 'pointer' }}>
                                {restProps.label}
                            </label>
                        </div>
                    )}
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
                            ...restProps,
                        })}
                    </div>
                </div>
            </div>
        );
    }
);

export default memo(Item);
