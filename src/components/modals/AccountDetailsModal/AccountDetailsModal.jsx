import React from "react";
import { X, Trash2 } from "lucide-react";
import styles from "./AccountDetailsModal.module.css";

const AccountDetailsModal = ({ account, onClose, onDisconnect }) => {
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains(styles.modalBackdrop)) {
      onClose();
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>
            {account.provider.charAt(0).toUpperCase() +
              account.provider.slice(1)}
          </h2>
          <button className={styles.modalClose} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <h3 className={styles.emailsTitle}>Comptes connectés</h3>
          <ul className={styles.emailsList}>
            {account.emails.map((email) => (
              <li key={email} className={styles.emailItem}>
                <span className={styles.emailAddress}>{email}</span>
                <button
                  className={styles.disconnectButton}
                  onClick={() => onDisconnect(account.id, email)}
                  aria-label={`Déconnecter ${email}`}
                >
                  <Trash2 size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsModal;
