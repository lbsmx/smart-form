import styles from './form-card.module.css';
import FieldType from '@/app/form/[id]/components/form-item/field-types';
import { BarChartOutlined, EyeOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import Link from 'next/link';

type Form = {
    id: string;
    title: string;
    formList: FieldType[];
    updatedAt: Date;
};

const fieldTypeMap = {
    textInput: '文本框',
    textArea: '文本域',
    checkboxGroup: '多选框',
    radioGroup: '单选框',
    uploader: '附件',
};

export default function FormCard({ form }: { form: Form }) {
    return (
        <div className={styles.card}>
            <div className={styles.tooltipWrapper}>
                <Link href={`/form/${form.id}`} target="_blank">
                    <Tooltip title="查看表单">
                        <EyeOutlined
                            className={styles.dataIcon}
                            style={{ marginRight: '8px' }}
                        />
                    </Tooltip>
                </Link>
                <Link href={''}>
                    <Tooltip title="查看填写数据">
                        <BarChartOutlined className={styles.dataIcon} />
                    </Tooltip>
                </Link>
            </div>
            <h2 className={styles.formTitle}>{form.title}</h2>
            <div className={styles.fields}>
                {form.formList.map((field) => (
                    <div key={field.id} className={styles.field}>
                        <div className={styles.fieldHeader}>
                            <span className={styles.fieldLabel}>
                                {field.label}
                                {field.required && (
                                    <span className={styles.required}>*</span>
                                )}
                            </span>
                            <span className={styles.fieldType}>
                                {
                                    fieldTypeMap[
                                        field.type as keyof typeof fieldTypeMap
                                    ]
                                }
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.meta}>
                <span>
                    更新时间: {new Date(form.updatedAt).toLocaleString()}
                </span>
            </div>
        </div>
    );
}
