'use client';

import { Menu } from 'antd';
import { FormOutlined, AppstoreOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './sidebar.module.css';

export default function Sidebar() {
    const pathname = usePathname();

    const items = [
        {
            key: '/home/template',
            icon: <AppstoreOutlined />,
            label: <Link href="/home/template">模板</Link>,
        },
        {
            key: '/home/my-forms',
            icon: <FormOutlined />,
            label: <Link href="/home/my-forms">我的表单</Link>,
        },
    ];

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <h2 className={styles.title}>表单管理</h2>
            </div>
            <Menu
                mode="inline"
                selectedKeys={[pathname]}
                items={items}
                className={styles.menu}
            />
        </div>
    );
}
