"use client";

interface FormTitleProps {
  initialTitle: string;
}

import React, { useState, useRef, useEffect } from "react";
import styles from "./form-title.module.css";

export default function FormTitle({ initialTitle }: FormTitleProps) {
  const [title, setTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);
  const [originalTitle, setOriginalTitle] = useState(initialTitle);
  const textRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
      document.execCommand("selectAll", false, undefined);
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalTitle(title); // 保存编辑前的标题
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (textRef.current) {
      const trimmedTitle = textRef.current.innerText.trim();
      if (trimmedTitle === "") {
        setTitle(originalTitle); // 恢复编辑前的标题
        textRef.current.innerHTML = originalTitle; // 确保 DOM 中的内容正确
      } else {
        setTitle(trimmedTitle.slice(0, 30)); // 限制最大长度为30
        textRef.current.innerHTML = trimmedTitle.slice(0, 30); // 更新 DOM 中的内容
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLHeadingElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 阻止默认的换行行为
      event.target.blur();
    } else if (
      textRef.current &&
      textRef.current.innerText.length >= 30 &&
      ![
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
      ].includes(event.key)
    ) {
      event.preventDefault(); // 阻止输入超过30个字符
    }
  };

  return (
    <div className={styles.formTitleContainer}>
      <h1
        ref={textRef}
        contentEditable={isEditing}
        onClick={handleEdit}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={styles.formTitleText}
      >
        {title}
      </h1>
    </div>
  );
}
