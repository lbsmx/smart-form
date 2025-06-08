import dbConnect from '@/lib/mongodb';
import Templates from '@/lib/template';
import GenerateTemplate from './components/generate-template/generate-template';
import styles from './page.module.css';
import TemplateList from './components/template-list';
import { Suspense } from 'react';
import TemplateListSkeleton from './components/template-list/template-list-skeleton';
import { auth } from '@/auth';

export default async function Template() {
    await dbConnect();
    // 不再使用await而是直接将promise作为参数传入子组件
    // 子组件使用use消费promise，从而使得子组件可以等待异步任务完成后再进行渲染
    // 为嵌套在外层的suspense生效
    const templates = Templates.find().exec();
    const session = await auth();

    return (
        <div className={styles.layout}>
            <div className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.title}>表单模板</h1>
                    <p className={styles.description}>
                        选择或创建适合您需求的表单模板
                    </p>
                </header>
                <GenerateTemplate disabled={!session} />
                <Suspense fallback={<TemplateListSkeleton />}>
                    <TemplateList templates={templates} />
                </Suspense>
            </div>
        </div>
    );
}
