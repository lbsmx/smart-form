import '@ant-design/v5-patch-for-react-19';
import { redirect } from 'next/navigation';

export default function Home() {
    redirect('/home');
}
