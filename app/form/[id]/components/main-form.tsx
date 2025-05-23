"use client";

import { Radio } from "antd";
import styles from "@/app/form/[id]/components/styles/main-form.module.css";
import DroppableContainer from "./droppable-container/droppable-container";
import FormTitle from "./form-title/form-title";
import { SortableItemProps } from "@/app/form/[id]/components/sortable-item/sortable-item";
import PreviewForm from "./preview-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setEditable } from "@/store/form";

export default function MainForm({
    formList,
}: {
    formList: SortableItemProps[];
}) {
    const dispatch = useDispatch<AppDispatch>();
    const editable = useSelector((state: RootState) => state.form.editable);

    return (
        <div className={styles.formContainer}>
            <div className={styles.formTypeContainer}>
                <Radio.Group
                    value={editable}
                    onChange={(e) => dispatch(setEditable(e.target.value))}
                >
                    <Radio.Button value={true}>编辑</Radio.Button>
                    <Radio.Button value={false}>预览</Radio.Button>
                </Radio.Group>
            </div>
            <div className={styles.form}>
                <FormTitle editable={editable} />
                {editable ? (
                    <DroppableContainer formList={formList} />
                ) : (
                    <PreviewForm formList={formList} />
                )}
            </div>
        </div>
    );
}
