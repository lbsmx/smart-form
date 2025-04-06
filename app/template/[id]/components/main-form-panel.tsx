import MainHeader from './main-header';
import MainForm from './main-form';

export default function MainFormPanel() {
    return (
        <div style={{ height: '100%', overflow: 'hidden' }}>
            <MainHeader></MainHeader>
            <MainForm></MainForm>
        </div>
    );
}
