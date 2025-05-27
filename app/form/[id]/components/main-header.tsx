'use client';

import { Button, Space, Popover } from 'antd';
import {
    UndoOutlined,
    RedoOutlined,
    SaveOutlined,
    EyeOutlined,
    ShareAltOutlined,
    CopyOutlined,
} from '@ant-design/icons';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { FormUpdateType, historyManager, updateForm } from '@/store/form';

export default function MainHeader() {
    const [copied, setCopied] = React.useState(false);
    const [shareLink, setShareLink] = React.useState('');
    const formId = useSelector((state: RootState) => state.form.formId);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        setShareLink(`${window.location.host}/share/${formId}`);
    }, [formId]);

    const handleCopy = () => {
        navigator.clipboard
            .writeText(shareLink)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // 2秒后恢复
            })
            .catch((err) => {
                console.error('复制失败:', err);
            });
    };

    const content = (
        <div style={{ width: 300 }}>
            <p>将以下链接复制并分享给他人：</p>
            <div
                style={{
                    wordBreak: 'break-all',
                    marginBottom: 8,
                    padding: '4px 8px',
                    background: '#f0f0f0',
                    borderRadius: 4,
                }}
            >
                {shareLink}
            </div>
            <Button
                icon={<CopyOutlined />}
                onClick={handleCopy}
                block
                type={copied ? 'primary' : 'default'}
            >
                {copied ? '已复制' : '复制链接'}
            </Button>
        </div>
    );

    const handleUndo = () => {
        const state = historyManager.undo();
        if (!state) return;
        switch (state.action) {
            case FormUpdateType.UpdateTitle:
                const { oldTitle, formTitle } = state.data;
                dispatch(
                    updateForm({
                        type: FormUpdateType.UpdateTitle,
                        data: {
                            oldTitle: formTitle,
                            formTitle: oldTitle,
                        },
                        history: true,
                    })
                );
                break;
            case FormUpdateType.AddItem:
                const { index, newItem } = state.data;
                dispatch(
                    updateForm({
                        type: FormUpdateType.DeleteItem,
                        data: {
                            index,
                            item: newItem,
                        },
                        history: true,
                    })
                );
                break;
            case FormUpdateType.DeleteItem:
                dispatch(
                    updateForm({
                        type: FormUpdateType.AddItem,
                        data: {
                            index: state.data.index,
                            newItem: state.data.item,
                        },
                        history: true,
                    })
                );
                break;
            case FormUpdateType.UpdateItem:
                dispatch(
                    updateForm({
                        type: FormUpdateType.UpdateItem,
                        data: {
                            id: state.data.id,
                            old: state.data.updated,
                            updated: state.data.old,
                        },
                        history: true,
                    })
                );
                break;
            case FormUpdateType.SortList:
                dispatch(
                    updateForm({
                        type: FormUpdateType.SortList,
                        data: {
                            oldIndex: state.data.newIndex,
                            newIndex: state.data.oldIndex,
                        },
                        history: true,
                    })
                );
                break;
        }
    };

    const handleRedo = () => {
        const state = historyManager.redo();
        if (!state) return;
        switch (state.action) {
            case FormUpdateType.UpdateTitle:
                const { oldTitle, formTitle } = state.data;
                dispatch(
                    updateForm({
                        type: FormUpdateType.UpdateTitle,
                        data: {
                            oldTitle,
                            formTitle,
                        },
                        history: true,
                    })
                );
                break;
            case FormUpdateType.AddItem:
                const { index, newItem } = state.data;
                dispatch(
                    updateForm({
                        type: FormUpdateType.AddItem,
                        data: {
                            index,
                            newItem,
                        },
                        history: true,
                    })
                );
                break;
            case FormUpdateType.DeleteItem:
                dispatch(
                    updateForm({
                        type: FormUpdateType.DeleteItem,
                        data: {
                            index: state.data.index,
                            item: state.data.item,
                        },
                        history: true,
                    })
                );
                break;
            case FormUpdateType.UpdateItem:
                dispatch(
                    updateForm({
                        type: FormUpdateType.UpdateItem,
                        data: {
                            id: state.data.id,
                            old: state.data.old,
                            updated: state.data.updated,
                        },
                        history: true,
                    })
                );
                break;
            case FormUpdateType.SortList:
                dispatch(
                    updateForm({
                        type: FormUpdateType.SortList,
                        data: {
                            oldIndex: state.data.oldIndex,
                            newIndex: state.data.newIndex,
                        },
                        history: true,
                    })
                );
                break;
        }
    };

    return (
        <div
            style={{
                background: '#fff',
                padding: '16px 24px',
                borderBottom: '1px solid #e9e9e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <Space>
                <Button icon={<UndoOutlined />} onClick={handleUndo} />
                <Button icon={<RedoOutlined />} onClick={handleRedo} />
                <Button icon={<SaveOutlined />} type='primary' />
                <Button icon={<EyeOutlined />} />
            </Space>

            <Popover content={content} title='分享表单' trigger='click'>
                <Button icon={<ShareAltOutlined />} type='primary'>
                    分享
                </Button>
            </Popover>
        </div>
    );
}
