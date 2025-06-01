'use client';

import { Provider } from 'react-redux';
import store from '@/store';
import { Button } from 'antd';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            {/* <Button>layout</Button> */}
            {children}
        </Provider>
    );
}
