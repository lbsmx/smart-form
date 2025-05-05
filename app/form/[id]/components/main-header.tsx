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
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function MainHeader() {
    const [copied, setCopied] = React.useState(false);
    const [shareLink, setShareLink] = React.useState('');
    const formId = useSelector((state: RootState) => state.form.formId);

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
                <Button icon={<UndoOutlined />} />
                <Button icon={<RedoOutlined />} />
                <Button icon={<SaveOutlined />} type="primary" />
                <Button icon={<EyeOutlined />} />
            </Space>

            <Popover content={content} title="分享表单" trigger="click">
                <Button icon={<ShareAltOutlined />} type="primary">
                    分享
                </Button>
            </Popover>
        </div>
    );
}
