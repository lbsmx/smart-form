import { Empty } from 'antd';
import styles from '@/app/form/[id]/components/styles/main-form.module.css';
import SortableItem from '@/app/form/[id]/components/sortable-item/sortable-item.tsx';
import DroppableContainer from './droppable-container/droppable-container';
import FormTitle from './form-title/form-title';

export default function MainForm({ formList }) {
    return (
        <div className={styles.formContainer}>
            <FormTitle initialTitle="Untitled Form" />
            <div className={styles.form} style={{ padding: '24px 0' }}>
                <DroppableContainer formList={formList}>
                    {formList.length > 0 ? (
                        formList.map((item, index) => (
                            <SortableItem
                                {...item}
                                key={item.id}
                                sortable={true}
                                disabled={false}
                            />
                        ))
                    ) : (
                        <Empty
                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                            description="No items in the form"
                        />
                    )}
                </DroppableContainer>
            </div>
        </div>
    );
}
