import Sidebar from '../components/sidebar/sidebar';
import styles from '../page.module.css';

export default function MyForms() {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.content}>
                <header className={styles.header}>
                    <h1 className={styles.title}>我的表单</h1>
                    <p className={styles.description}>
                        查看和管理您创建的表单。
                    </p>
                </header>
                <div className={styles.container}>
                    {/* 这里将显示用户的表单列表 */}
                </div>
            </div>
        </div>
    );
}
