import React from "react";
import styles from "./AccountCard.module.css";

const AccountCard = ({ provider, icon, onClick }) => {
  return (
    <button className={styles.accountCard} onClick={onClick}>
      <div className={styles.accountIcon}>{icon}</div>
      <span className={styles.accountName}>{provider}</span>
    </button>
  );
};

export default AccountCard;
