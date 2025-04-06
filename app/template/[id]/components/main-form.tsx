'use client';

import styles from '@/app/template/[id]/components/styles/main-form.module.css';
import { Form, Input } from 'antd';
import DraggableWrapper from './form-item/draggble-wrapper';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
export default function MainForm() {
    const [formList, setFormList] = useState([
        {
            id: '1',
            type: 'textInput',
        },
        {
            id: '2',
            type: 'textInput',
        },
        {
            id: '3',
            type: 'textInput',
        },
    ]);

    const resetFormItem = ({ dragIndex, hoverIndex, item }) => {
        const copyFormList = [...formList];
        if (dragIndex === undefined) {
            const newFormItem = generateFormItem(item);
            copyFormList.splice(hoverIndex, 0, newFormItem);
            setFormList(copyFormList);
        } else {
            const [removed] = copyFormList.splice(dragIndex, 1);
            copyFormList.splice(hoverIndex, 0, removed);
            setFormList(copyFormList);
        }
    };

    const generateFormItem = (item) => {
        return {
            id: uuidv4(),
            type: item.type,
        };
    };

    return (
        <div className={styles.formContainer}>
            <Form
                className={styles.form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                size="large"
                style={{
                    padding: '24px',
                }}
            >
                {formList.map((item, index) => (
                    <DraggableWrapper
                        id={item.id}
                        type={item.type}
                        key={item.id}
                        index={index}
                        sortFn={resetFormItem}
                    >
                        <Form.Item label={item.id}>
                            <Input></Input>
                        </Form.Item>
                    </DraggableWrapper>
                ))}
            </Form>
        </div>
    );
}
