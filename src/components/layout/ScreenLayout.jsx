import React from "react";
import styles from "./ScreenLayout.module.css";

const ScreenLayout = ({ header, children, footer }) => (
  <div className={styles.screen}>
    {header && <div className={styles.header}>{header}</div>}
    <main className={styles.content}>{children}</main>
    {footer && <div className={styles.footer}>{footer}</div>}
  </div>
);

export default ScreenLayout;
