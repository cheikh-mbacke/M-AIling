import React, { useRef } from "react";
import styles from "./StyleSelector.module.css";
import { EMAIL_STYLES } from "../../utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const StyleSelector = ({ selectedStyle, onStyleChange }) => {
  const scrollRef = useRef(null);

  const scrollToStyle = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={styles.selector}>
      <h3 className={styles.title}>Choisissez le style</h3>

      <div className={styles.scrollContainer}>
        <button
          className={`${styles.scrollButton} ${styles.left}`}
          onClick={() => scrollToStyle("left")}
          aria-label="Précédent"
        >
          <ChevronLeft size={20} />
        </button>

        <div ref={scrollRef} className={styles.stylesWrapper}>
          <div className={styles.stylesList}>
            {EMAIL_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => onStyleChange(style.id)}
                className={`${styles.styleButton} ${
                  selectedStyle === style.id ? styles.selected : ""
                }`}
                style={{
                  "--style-color": style.color,
                }}
              >
                <span className={styles.icon}>{style.icon}</span>
                <span className={styles.label}>{style.label}</span>
                {selectedStyle === style.id && (
                  <span className={styles.indicator} />
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          className={`${styles.scrollButton} ${styles.right}`}
          onClick={() => scrollToStyle("right")}
          aria-label="Suivant"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default StyleSelector;
