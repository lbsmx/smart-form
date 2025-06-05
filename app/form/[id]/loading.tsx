'use client';

import React from 'react';
import { Skeleton } from 'antd';

export default function DndSkeletonLoader() {
    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* 左侧 - 侧边栏 (SideFormItemPanel) */}
            <div
                style={{
                    width: '350px',
                    height: '100vh',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                    borderRight: '1px solid #dee2e6',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    padding: 24,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* 分组列表 */}
                {[...Array(2)].map((_, groupIndex) => (
                    <div
                        key={groupIndex}
                        style={{
                            marginBottom: 24,
                            padding: 12,
                            backgroundColor: '#fff',
                            border: '1px solid #e9ecef',
                            borderRadius: 8,
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            transition: 'box-shadow 0.3s ease',
                        }}
                    >
                        {/* 分组标题 */}
                        <div
                            style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                marginBottom: 16,
                                color: '#343a40',
                            }}
                        >
                            <Skeleton.Input
                                active
                                size="small"
                                style={{ width: '60%' }}
                            />
                        </div>

                        {/* 表单项网格布局 */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: 16,
                            }}
                        >
                            {[...Array(6)].map((_, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    style={{
                                        position: 'relative',
                                        opacity: 0.7,
                                    }}
                                >
                                    <Skeleton.Input
                                        active
                                        size="small"
                                        style={{
                                            width: '100%',
                                            height: 45,
                                            borderRadius: 4,
                                            backgroundColor: '#e2e6ea',
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* 右侧 - 主区域 (MainFormPanel) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* MainHeader - 精准还原样式 */}
                <div
                    style={{
                        padding: '16px 24px',
                        borderBottom: '1px solid #e9e9e9',
                        background: '#fff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    {/* 左侧按钮组 */}
                    <div
                        style={{
                            display: 'flex',
                            gap: 8,
                            alignItems: 'center',
                        }}
                    >
                        <Skeleton.Button active />
                        <Skeleton.Button active />
                        <Skeleton.Button active />
                        <Skeleton.Button active />
                    </div>

                    {/* 右侧分享按钮 */}
                    <Skeleton.Button active />
                </div>

                {/* 表单内容区域 - 居中版本 */}
                <div
                    style={{
                        flex: 1,
                        padding: 24,
                        overflowY: 'auto',
                        background: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 24,
                    }}
                >
                    {/* 编辑/预览切换按钮组 */}
                    <div
                        style={{
                            display: 'flex',
                            gap: 8,
                            padding: '8px 12px',
                            background: '#f0f0f0',
                            borderRadius: 4,
                            width: 'fit-content',
                        }}
                    >
                        <Skeleton.Button
                            active
                            size="small"
                            style={{ width: 60 }}
                        />
                        <Skeleton.Button
                            active
                            size="small"
                            style={{ width: 60 }}
                        />
                    </div>

                    {/* 表单标题 + 表单内容区块合并 */}
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 16,
                            flex: 1,
                            padding: '16px',
                            borderRadius: '8px',
                            overflowY: 'auto',
                            boxShadow: '0 6px 24px #1f232914',
                        }}
                    >
                        {/* 表单标题 */}
                        <Skeleton.Input
                            active
                            style={{ width: '40%', height: 32 }}
                        />

                        {/* 表单项骨架区块 */}
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12,
                            }}
                        >
                            {[...Array(5)].map((_, index) => (
                                <Skeleton.Input
                                    key={index}
                                    active
                                    style={{
                                        padding: '18px 32px',
                                        width: '100%',
                                        height: 100,
                                        boxSizing: 'border-box',
                                        borderRadius: 4,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
