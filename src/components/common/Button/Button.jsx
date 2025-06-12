import React from "react";
import styles from "./Button.module.css";

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "large",
  icon,
  fullWidth = false,
  ...props
}) => {
  const className = `
    ${styles.button} 
    ${styles[`button--${variant}`]} 
    ${styles[`button--${size}`]} 
    ${fullWidth ? styles["button--fullWidth"] : ""}
  `.trim();

  return (
    <button className={className} onClick={onClick} {...props}>
      {icon && <span className={styles.buttonIcon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
