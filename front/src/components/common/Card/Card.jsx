import React from "react";
import styles from "./Card.module.css";

const Card = ({ children, className, onClick, ...props }) => {
  const cardClassName = `${styles.card} ${className || ""}`.trim();

  return (
    <div className={cardClassName} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
