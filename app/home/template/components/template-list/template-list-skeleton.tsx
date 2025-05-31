import styles from './template-list.module.css';

export default function TemplateListSkeleton({ count = 50 }) {
    return (
        <div className={styles.container}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div
                            className={`${styles.skeleton} ${styles.title}`}
                        ></div>
                    </div>
                    <div className={styles.cardBody}>
                        <div
                            className={`${styles.skeleton} ${styles.line}`}
                        ></div>
                        <div
                            className={`${styles.skeleton} ${styles.line}`}
                        ></div>
                        <div
                            className={`${styles.skeleton} ${styles.line} ${styles.wide}`}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
