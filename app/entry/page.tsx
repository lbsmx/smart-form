import { Table } from 'antd';
import styles from './page.module.css';

async function getFormData(formId: string) {
    // 这里实现获取表单数据的逻辑
    const res = await fetch(`/api/form/${formId}`);
    return res.json();
}

export default async function Entry({
    searchParams,
}: {
    searchParams: { formId: string };
}) {
    const data = await getFormData(searchParams.formId);

    const columns = [
        {
            title: '字段名',
            dataIndex: 'fieldName',
            key: 'fieldName',
        },
        {
            title: '填写内容',
            dataIndex: 'value',
            key: 'value',
        },
    ];

    return (
        <div className={styles.container}>
            <h1>表单数据展示</h1>
            <Table
                dataSource={data}
                columns={columns}
                rowKey="id"
                pagination={false}
            />
        </div>
    );
}
