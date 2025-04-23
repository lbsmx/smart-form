// components/TemplateCard.tsx
import React from "react";
import styles from "./template-card.module.css";

interface TemplateCardProps {
  name: string;
  imageUrl: string;
  // 其他模板信息
}

const TemplateCard: React.FC<TemplateCardProps> = ({ name, imageUrl }) => {
  return (
    <div className={styles.card}>
      <img src={imageUrl} alt={name} className={styles.cardImage} />
      <h3 className={styles.cardTitle}>{name}</h3>
      {/* 其他模板信息 */}
    </div>
  );
};

export default TemplateCard;
