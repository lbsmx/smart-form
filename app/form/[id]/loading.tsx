'use client';

import { Card, Col, Divider, Row, Skeleton } from 'antd';
import React from 'react';

const { Input } = Skeleton;
export default function Loading() {
    return (
        <div style={{ display: 'flex' }}>
            {/* 侧边栏骨架 */}
            <div
                style={{
                    width: 350,
                    padding: 24,
                    borderRight: '1px solid #e8e8e8',
                }}
            >
                <Skeleton active paragraph={{ rows: 0 }} />
                {[...Array(3)].map((_, i) => (
                    <div key={i} style={{ marginBottom: 24 }}>
                        <Divider style={{ marginTop: 0 }} />
                        <Skeleton.Button
                            block
                            style={{ height: 40, marginBottom: 12 }}
                            active
                        />
                        <Skeleton active paragraph={{ rows: 3 }} />
                    </div>
                ))}
            </div>

            {/* 主表单区域骨架 */}
            <div style={{ flex: 1, padding: 24 }}>
                <Card
                    title={<Skeleton.Input style={{ width: '20%' }} active />}
                >
                    {[...Array(5)].map((_, i) => (
                        <Row
                            key={i}
                            gutter={[16, 16]}
                            style={{ marginBottom: 16 }}
                        >
                            <Col span={18}>
                                <Skeleton.Input
                                    style={{ width: '100%', height: 40 }}
                                    active
                                />
                            </Col>
                            <Col span={6}>
                                <Input
                                    style={{ width: '100%', height: 40 }}
                                    active
                                />
                            </Col>
                        </Row>
                    ))}
                </Card>
            </div>
        </div>
    );
}
