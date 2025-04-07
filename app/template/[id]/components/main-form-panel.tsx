import MainHeader from './main-header';
import MainForm from './main-form';

export default function MainFormPanel(props) {
    return (
        <div style={{ height: '100%', overflow: 'hidden' }}>
            <MainHeader></MainHeader>
            <MainForm formList={props.formList}></MainForm>
        </div>
    );
}
