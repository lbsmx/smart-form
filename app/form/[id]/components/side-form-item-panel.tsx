import React, { memo } from 'react';
import styles from '@/app/form/[id]/components/styles/side-form-item-panel.module.css';
import SortableItem from '@/app/form/[id]/components/sortable-item/sortable-item.tsx';
import { SortableItemProps } from './sortable-item/sortable-item';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface SideFormItemPanelProps {
    active: SortableItemProps | null;
    formItemLib: Record<string, SortableItemProps[]> | null;
}

function SideFormItemPanel({ active, formItemLib }: SideFormItemPanelProps) {
    const editable = useSelector((state: RootState) => state.form.editable);

    return (
        <div className={`${styles.panel} ${editable ? styles.editable : ''}`}>
            <div style={{ padding: '24px', width: '350px' }}>
                {formItemLib
                    ? Object.entries(formItemLib).map(
                          ([label, sets], groupIndex) => (
                              <div
                                  key={groupIndex}
                                  className={styles.componentContainer}
                              >
                                  <h3 className={styles.categoryTitle}>
                                      {label}
                                  </h3>
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
        </div>
    );
}

export default memo(SideFormItemPanel);
