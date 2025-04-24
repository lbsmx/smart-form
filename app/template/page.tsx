import dbConnect from '@/lib/mongodb';
import Templates from '@/lib/template';
import TemplateCard from '@/app/template/components/template-card/template-card';
import styles from './page.module.css';

export default async function Template() {
    await dbConnect();
    const templates = await Templates.find();

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h1 className={styles.title}>Templates</h1>
                <p className={styles.description}>
                    Explore a variety of templates to choose from.
                </p>
            </header>
            <div className={styles.container}>
                {templates.map((item) => (
                    <TemplateCard
                        key={item._id}
                        name={item.name}
                        fields={item.structure.formList}
                    />
                ))}
            </div>
        </div>
    );
}
