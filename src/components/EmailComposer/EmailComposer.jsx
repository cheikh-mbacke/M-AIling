import React, { useRef, useEffect } from "react";
import { Type, AlertCircle } from "lucide-react";
import { debounce } from "../../utils";
import styles from "./EmailComposer.module.css";

const EmailComposer = ({ value, onChange, onGenerate }) => {
  const textareaRef = useRef(null);
  const charCount = value.length;
  const maxChars = 1000;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  // Debounced onChange pour la sauvegarde automatique
  const debouncedOnChange = debounce((newValue) => {
    onChange(newValue);
  }, 500);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= maxChars) {
      onChange(newValue);
      debouncedOnChange(newValue);
    }
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter pour générer
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onGenerate();
    }
  };

  return (
    <div className={styles.composer}>
      <div className={styles.header}>
        <div className={styles.labelGroup}>
          <Type size={18} />
          <label htmlFor="message" className={styles.label}>
            Votre message
          </label>
        </div>
        <span
          className={`${styles.charCount} ${
            charCount > maxChars * 0.9 ? styles.warning : ""
          }`}
        >
          {charCount}/{maxChars}
        </span>
      </div>

      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          id="message"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Écrivez votre message librement, sans vous soucier du style..."
          className={styles.textarea}
          rows={4}
        />

        {charCount === 0 && (
          <div className={styles.hint}>
            <AlertCircle size={16} />
            <span>
              Astuce : Appuyez sur Ctrl+Entrée pour générer rapidement
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailComposer;
