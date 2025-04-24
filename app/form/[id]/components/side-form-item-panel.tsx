import React, { memo } from 'react';
import styles from '@/app/form/[id]/components/styles/side-form-item-panel.module.css';
import SortableItem from '@/app/form/[id]/components/sortable-item/sortable-item.tsx';

function SideFormItemPanel(props) {
    const { active, formItemLib } = props;

    return (
        <div className={styles.panel}>
            {formItemLib.map((group, groupIndex) => (
                <div key={groupIndex} className={styles.componentContainer}>
                    <h3 className={styles.categoryTitle}>{group.label}</h3>
                    <div className={styles.itemContainer}>
                        {group.sets.map((field, fieldIndex) => (
                            <SortableItem
                                key={field.id}
                                {...field}
                                sortable={false}
                                disabled={active != null}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default memo(SideFormItemPanel);
