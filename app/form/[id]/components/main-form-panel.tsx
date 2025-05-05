'use client';

import MainHeader from './main-header';
import MainForm from './main-form';
import { CSSProperties, memo } from 'react';

function MainFormPanel(props) {
    const style: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
    };

    return (
        <div style={style}>
            <MainHeader></MainHeader>
            <MainForm formList={props.formList}></MainForm>
        </div>
    );
}

export default memo(MainFormPanel);
