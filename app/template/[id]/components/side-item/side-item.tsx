import React, { forwardRef } from "react";
import styles from "@/app/template/[id]/components/side-item/side-item.module.css";
import { SortableItemProps } from "@/app/template/[id]/components/sortable-item/sortable-item";
import { setFormList } from "@/store/form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { v4 as uuidv4 } from "uuid";

interface SideItemProps extends SortableItemProps {}

const SideItem = forwardRef<HTMLDivElement, SideItemProps>(
  ({ listeners, attributes, type, label }, ref) => {
    const dispatch = useDispatch();
    const formList = useSelector((state: RootState) => state.form.formList);

    // 添加当前item到form中
    const handleClick = () => {
      dispatch(
        setFormList([
          ...formList,
          {
            id: uuidv4(),
            sortable: true,
            type,
            label,
            disabled: false,
          },
        ])
      );
    };

    // 根据 type 获取对应的图标
    const getIcon = (type: string) => {
      switch (type) {
        case "textInput":
          return <span className={styles.icon}>🔍</span>; // 示例图标
        case "numberInput":
          return <span className={styles.icon}>🔢</span>; // 示例图标
        case "textarea":
          return <span className={styles.icon}>📝</span>; // 示例图标
        default:
          return <span className={styles.icon}>🔗</span>; // 默认图标
      }
    };

    return (
      <div
        ref={ref}
        {...listeners}
        {...attributes}
        className={styles.sideItem}
        onClick={handleClick}
      >
        {getIcon(type)}
        <span className={styles.label}>{label}</span>
      </div>
    );
  }
);

export default SideItem;
