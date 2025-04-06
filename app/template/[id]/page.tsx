'use client';

interface TemplateParams {
    id: string | undefined;
}

import * as React from 'react';
import styles from '@/app/template/[id]/page.module.css';
import SideFormItemPanel from './components/side-form-item-panel';
import MainFormPanel from './components/main-form-panel';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
export default function Template({ params }: { params: TemplateParams }) {
    const { id }: { id: string | undefined } = React.use(params);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className={styles.page}>
                <SideFormItemPanel></SideFormItemPanel>
                <MainFormPanel></MainFormPanel>
            </div>
        </DndProvider>
    );
}
