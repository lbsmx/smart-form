import './globals.css';
import Header from '@/app/components/header/header';

import { Geist, Geist_Mono } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang='en'
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
            <body>
                <AntdRegistry>
                    <Header />
                    <main
                        style={{
                            marginTop: '64px',
                            height: 'calc(100vh - 64px)',
                        }}
                    >
                        {children}
                    </main>
                    {/* 避开固定 header 的高度 */}
                </AntdRegistry>
            </body>
        </html>
    );
}
