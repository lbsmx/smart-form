import Sidebar from './components/sidebar/sidebar';

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1, height: '100vh', overflow: 'hidden' }}>
                {children}
            </div>
        </div>
    );
}
