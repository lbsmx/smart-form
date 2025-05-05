import PreviewForm from '@/app/form/[id]/components/preview-form/preview-form';
import Forms from '@/lib/form';
import styles from '@/app/share/[id]/page.module.css';
import dbConnect from '@/lib/mongodb';

export default async function Share({ params }: { params: { id: string } }) {
    const { id } = await params;

    try {
        await dbConnect();
        const formData = await Forms.findById(id);
        const { formList, title } = formData;

        return (
            <div className={styles.page}>
                <div className={styles.formContainer}>
                    <h1>{title}</h1>
                    <PreviewForm formId={id} share={true} formList={formList} />
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error fetching form data:', error);
        return <div>表单加载失败，请稍后再试</div>;
    }
}
