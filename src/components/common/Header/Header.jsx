import React from "react";
import { ArrowLeft, Settings } from "lucide-react";
import styles from "./Header.module.css";

const Header = ({ title = "MailReform", onBack, onSettingsClick }) => {
  return (
    <header className={styles.appHeader}>
      <div className={styles.headerContainer}>
        <div className={styles.leftAction}>
          {onBack && (
            <button className={styles.iconButton} onClick={onBack}>
              <ArrowLeft size={24} />
            </button>
          )}
        </div>

        <div className={styles.headerTitle}>
          <img
            src="/icons/icon-192x192.png"
            alt="Logo"
            className={styles.logoIcon}
          />
          <h1>{title}</h1>
        </div>

        <div className={styles.rightAction}>
          {onSettingsClick && (
            <button className={styles.iconButton} onClick={onSettingsClick}>
              <Settings size={24} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
