import React, { memo } from 'react';
import styles from '@/app/form/[id]/components/styles/side-form-item-panel.module.css';
import SortableItem from '@/app/form/[id]/components/sortable-item/sortable-item.tsx';
import { SortableItemProps } from './sortable-item/sortable-item';

interface SideFormItemPanelProps {
    active: SortableItemProps | null;
    formItemLib: Record<string, SortableItemProps[]>;
}

function SideFormItemPanel({ active, formItemLib }: SideFormItemPanelProps) {
    return (
        <div className={styles.panel}>
            {formItemLib
                ? Object.entries(formItemLib).map(
                      ([label, sets], groupIndex) => (
                          <div
                              key={groupIndex}
                              className={styles.componentContainer}
                          >
                              <h3 className={styles.categoryTitle}>{label}</h3>
                              <div className={styles.itemContainer}>
                                  {sets.map((field) => (
                                      <SortableItem
                                          key={field.id}
                                          {...field}
                                          sortable={false}
                                          disabled={active != null}
                                      />
                                  ))}
                              </div>
                          </div>
                      )
                  )
                : null}
        </div>
    );
}

export default memo(SideFormItemPanel);
