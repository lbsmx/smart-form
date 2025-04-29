import Link from 'next/link';
import styles from './not-found.module.css';

const NotFound = () => {
    return (
        <div className={styles.notFoundContainer}>
            <h1 className={styles.notFoundTitle}>404 - Form Not Found</h1>
            <p className={styles.notFoundDescription}>
                The form you are looking for does not exist.
            </p>
            <div className={styles.actions}>
                <Link href="/template">
                    <button className={styles.actionButton}>
                        Go to Template Page
                    </button>
                </Link>
                <Link href="/">
                    <button className={styles.actionButton}>Go to Home</button>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
