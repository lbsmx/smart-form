import React, { forwardRef } from 'react';
import styles from '@/app/form/[id]/components/side-item/side-item.module.css';
import { SortableItemProps } from '@/app/form/[id]/components/sortable-item/sortable-item';
import { FormUpdateType, updateForm } from '@/store/form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { v4 as uuid } from 'uuid';

interface SideItemProps extends SortableItemProps {}

const SideItem = forwardRef<HTMLDivElement, SideItemProps>(
    ({ listeners, attributes, type, label, required, options }, ref) => {
        const dispatch = useDispatch<AppDispatch>();
        const formList = useSelector((state: RootState) => state.form.formList);

        // 添加当前item到form中
        const handleClick = () => {
            dispatch(
                updateForm({
                    type: FormUpdateType.AddItem,
                    data: {
                        index: formList.length,
                        newItem: {
                            id: uuid(),
                            sortable: true,
                            type,
                            label,
                            disabled: false,
                            required,
                            options,
                        },
                    },
                })
            );
        };

        // 根据 type 获取对应的图标
        const getIcon = (type: string) => {
            switch (type) {
                case 'textInput':
                    return <span className={styles.icon}>🔤</span>; // 文本输入
                case 'textArea':
                    return <span className={styles.icon}>📝</span>; // 多行文本
                case 'rate':
                    return <span className={styles.icon}>⭐</span>; // 评分组件
                case 'radioGroup':
                    return <span className={styles.icon}>🔘</span>; // 单选框
                case 'checkboxGroup':
                    return <span className={styles.icon}>✅</span>; // 复选框
                case 'switch':
                    return <span className={styles.icon}>🔄</span>; // 开关
                default:
                    return <span className={styles.icon}>📎</span>; // 默认图标
            }
        };

        return (
            <div
                ref={ref}
                {...listeners}
                {...attributes}
                className={styles.sideItem}
                onClick={handleClick}
            >
                {getIcon(type)}
                <span className={styles.label}>{label}</span>
            </div>
        );
    }
);

SideItem.displayName = 'SideItem';

export default SideItem;
