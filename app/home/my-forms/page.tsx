import styles from './my-forms.module.css';
import dbConnect from '@/lib/mongodb';
import FormCard from './components/form-card/form-card';
import Forms from '@/lib/form';
import { auth } from '@/auth';

export default async function MyForms() {
    const [_, session] = await Promise.all([dbConnect(), auth()]);

    await dbConnect();
    const forms = await Forms.find({ userId: session?.user?.email });
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
