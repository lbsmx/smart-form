import { Button, Space } from 'antd';
import { login, logout } from '@/app/action/auth';
import styles from './login-out.module.css';

export default function LogInOut(props) {
    const { session } = props;

    return session?.user ? (
        <div className={styles.userContainer}>
            <Space size='large'>
                <span className={styles.userName}>{session?.user.name}</span>
                <Button color='default' variant='solid' onClick={logout}>
                    登出
                </Button>
            </Space>
        </div>
    ) : (
        <Button color='default' variant='solid' onClick={login}>
            登录
        </Button>
    );
}
