import { Table } from 'antd';
import styles from './page.module.css';
import dbConnect from '@/lib/mongodb';
import Submissions from '@/lib/submission';
import { headers } from 'next/headers';
import { parse } from 'cookie';
import Forms from '@/lib/form';
import FieldType from '@/app/form/[id]/components/form-item/field-types';

export default async function Entry({ params }: { params: { id: string } }) {
    const { id } = await params;
    const cookies = (await headers()).get('cookie');
    const cookiesObject = parse(cookies || '');
    const userId = cookiesObject.userid;
    const form = await Forms.find({ _id: id, userId });
    if (!form) {
        return <div>您没有当前填写数据的访问权限</div>;
    }
    await dbConnect();
    const submissions = await Submissions.find(
        { formId: id },
        { formData: 1, _id: 0 }
    );
    console.log(submissions);

    type ResultType = { key: number } & Record<string, any>;

    const dataSource = submissions.map((item, index) => {
        const { formData } = item;
        const result: ResultType = {
            key: index,
        };
        formData.forEach((fieldItem: FieldType) => {
            result[fieldItem.id] = fieldItem.value;
        });
        return result;
    });

    const columns = submissions[0].formData.map((item: FieldType) => {
        return {
            title: item.label,
            dataIndex: item.id,
            key: item.id,
        };
    });

    return (
        <div className={styles.container}>
            <h1>表单数据展示</h1>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
            />
        </div>
    );
}
