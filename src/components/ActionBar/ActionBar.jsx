import React from "react";
import { Edit3, Send, Save } from "lucide-react";
import styles from "./ActionBar.module.css";

const ActionBar = ({ onEdit, onSend, onSave }) => {
  return (
    <div className={styles.actionBar}>
      <div className={styles.container}>
        <button onClick={onEdit} className={styles.editButton}>
          <Edit3 size={18} />
          <span>Modifier</span>
        </button>

        {onSave && (
          <button onClick={onSave} className={styles.saveButton}>
            <Save size={18} />
            <span>Sauvegarder</span>
          </button>
        )}

        <button onClick={onSend} className={styles.sendButton}>
          <Send size={18} />
          <span>Envoyer</span>
        </button>
      </div>
    </div>
  );
};

export default ActionBar;
