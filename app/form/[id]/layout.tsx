'use client';

import { Provider } from 'react-redux';
import store from '@/store';

export default function Layout({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}
