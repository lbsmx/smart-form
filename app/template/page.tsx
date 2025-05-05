import dbConnect from '@/lib/mongodb';
import Templates from '@/lib/template';
import TemplateCard from '@/app/template/components/template-card/template-card';
import Sidebar from './components/sidebar/sidebar';
import GenerateTemplate from './components/generate-template/generate-template';
import styles from './page.module.css';

export default async function Template() {
    await dbConnect();
    const templates = await Templates.find();

    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.content}>
                <div className={styles.main}>
                    <header className={styles.header}>
                        <h1 className={styles.title}>表单模板</h1>
                        <p className={styles.description}>
                            选择或创建适合您需求的表单模板
                        </p>
                    </header>
                    <GenerateTemplate />
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
            </div>
        </div>
    );
}
