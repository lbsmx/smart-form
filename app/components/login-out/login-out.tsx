'use client';

import { Button } from 'antd';
import { login, logout } from '@/app/action/auth';

export default function LogInOut(props) {
    const { session } = props;
    return session?.user ? (
        <div>
            <span>{session?.user.name}</span>
            <Button color='default' variant='solid' onClick={logout}>
                登出
            </Button>
        </div>
    ) : (
        <Button color='default' variant='solid' onClick={login}>
            登录
        </Button>
    );
}
