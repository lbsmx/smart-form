import Sidebar from './components/sidebar/sidebar';

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <Sidebar />
            <div style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
                {children}
            </div>
        </div>
    );
}
