"use client";

import styles from "@/app/template/[id]/components/styles/main-form.module.css";
import { Form } from "antd";
import SortableItem from "@/app/template/[id]/components/sortable-item";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
export default function MainForm() {
  const [formList, setFormList] = useState([
    {
      id: "1",
      type: "textInput",
    },
    {
      id: "2",
      type: "textInput",
    },
    {
      id: "3",
      type: "textInput",
    },
  ]);

  const generateFormItem = (item) => {
    return {
      id: uuidv4(),
      type: item.type,
    };
  };

  return (
    <div className={styles.formContainer}>
      <Form
        className={styles.form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        size="large"
        style={{
          padding: "24px",
        }}
      >
        <SortableContext
          items={formList.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {formList.map((item, index) => (
            <SortableItem
              id={item.id}
              type={item.type}
              key={item.id}
              index={index}
            >
            </SortableItem>
          ))}
        </SortableContext>
      </Form>
    </div>
  );
}
