import styles from './my-forms.module.css';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import FormCard from './components/form-card/form-card';
import Forms from '@/lib/form';

export default async function MyForms() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userid')?.value;

    if (!userId) {
        return <div className={styles.error}>请先登录</div>;
    }

    await dbConnect();
    const forms = await Forms.find({ userId });
    const pureForms = forms.map((form) => {
        const { _id, title, formList, updatedAt } = form;
        return {
            id: _id.toString(),
            title,
            formList,
            updatedAt,
        };
    });

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>我的表单</h1>
            {pureForms.length === 0 ? (
                <div className={styles.empty}>您还没有创建任何表单</div>
            ) : (
                <div className={styles.grid}>
                    {pureForms.map((form) => (
                        <FormCard key={form.id} form={form} />
                    ))}
                </div>
            )}
        </div>
    );
}
