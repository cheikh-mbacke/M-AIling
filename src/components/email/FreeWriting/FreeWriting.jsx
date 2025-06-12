import React, { useState, useEffect, useRef } from "react";
import styles from "./FreeWriting.module.css";
import Button from "../../common/Button/Button";
import Header from "../../common/Header/Header";
import ScreenLayout from "../../layout/ScreenLayout";

const FreeWriting = ({ onBack, onNext }) => {
  const [message, setMessage] = useState(() => {
    return localStorage.getItem("draftMessage") || "";
  });

  useEffect(() => {
    localStorage.setItem("draftMessage", message);
  }, [message]);

  const textareaRef = useRef(null);

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  return (
    <ScreenLayout
      header={<Header title="Nouveau mail" onBack={onBack} />}
      footer={
        <div>
          <Button variant="primary" fullWidth onClick={() => onNext(message)}>
            Suivant
          </Button>
        </div>
      }
    >
      <main className={styles.content}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            autoResize();
          }}
          placeholder="Écris ton message comme tu le penses… Je m’occupe du reste 😊"
          className={styles.textarea}
        />
      </main>
    </ScreenLayout>
  );
};

export default FreeWriting;
