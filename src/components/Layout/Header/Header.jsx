import React from "react";
import { Mail, Menu, Settings } from "lucide-react";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <button className={styles.menuButton} aria-label="Menu">
          <Menu size={24} />
        </button>

        <div className={styles.brand}>
          <Mail className={styles.logo} size={24} />
          <h1 className={styles.title}>Email Assistant</h1>
        </div>

        <button className={styles.settingsButton} aria-label="Paramètres">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
