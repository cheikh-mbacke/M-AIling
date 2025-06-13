import React, { useState } from "react";
import styles from "./StyleCustomization.module.css";
import Header from "../../common/Header/Header";
import Button from "../../common/Button/Button";
import ScreenLayout from "../../layout/ScreenLayout";

// Données avec emojis et icônes
const languages = [
  { code: "FR", emoji: "🇫🇷" },
  { code: "EN", emoji: "🇬🇧" },
  { code: "ES", emoji: "🇪🇸" },
  { code: "DE", emoji: "🇩🇪" },
  { code: "IT", emoji: "🇮🇹" },
  { code: "PT", emoji: "🇵🇹" },
  { code: "NL", emoji: "🇳🇱" },
  { code: "RU", emoji: "🇷🇺" },
  { code: "ZH", emoji: "🇨🇳" },
  { code: "JA", emoji: "🇯🇵" },
];

const lengths = [
  { label: "Court", icon: "⏱" },
  { label: "Moyen", icon: "⏳" },
  { label: "Long", icon: "📜" },
];

const tones = [
  { label: "Professionnel", icon: "👔" },
  { label: "Formelle", icon: "🫱" },
  { label: "Amical", icon: "🤝" },
  { label: "Familier", icon: "😎" },
  { label: "Expert", icon: "🧠" },
  { label: "Confiant", icon: "💪" },
  { label: "Aimant", icon: "💌" },
  { label: "Prudent", icon: "🤔" },
  { label: "Affligeant", icon: "🥹" },
  { label: "Excitant", icon: "🥳" },
  { label: "Inspirant", icon: "🧘" },
  { label: "Informatif", icon: "💡" },
  { label: "Direct", icon: "💬" },
  { label: "Attentionné", icon: "😊" },
  { label: "Surprise", icon: "😮" },
  { label: "Persuasif", icon: "🎯" },
  { label: "Joyeux", icon: "😄" },
];

const StyleCustomization = ({ onBack, onNext }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("FR");
  const [selectedLength, setSelectedLength] = useState("Moyen");
  const [selectedTone, setSelectedTone] = useState("Professionnel");
  const [withEmoji, setWithEmoji] = useState(true);

  const handleSubmit = () => {
    const config = {
      language: selectedLanguage,
      length: selectedLength,
      tone: selectedTone,
      emoji: withEmoji,
    };
    onNext(config);
  };

  return (
    <ScreenLayout
      header={<Header title="Personnalisation du style" onBack={onBack} />}
      footer={
        <div className={styles.bottomBar}>
          <Button onClick={handleSubmit} fullWidth>
            Suivant
          </Button>
        </div>
      }
    >
      <div className={styles.container}>
        <section>
          <h2>Langue</h2>
          <div className={styles.horizontalScroll}>
            {languages.map(({ code, emoji }) => (
              <button
                key={code}
                className={`${styles.option} ${
                  selectedLanguage === code ? styles.selected : ""
                }`}
                onClick={() => setSelectedLanguage(code)}
              >
                <span className={styles.flag}>{emoji}</span>
                <span>{code}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2>Longueur</h2>
          <div className={styles.horizontalScroll}>
            {lengths.map(({ label, icon }) => (
              <button
                key={label}
                className={`${styles.option} ${
                  selectedLength === label ? styles.selected : ""
                }`}
                onClick={() => setSelectedLength(label)}
              >
                <span>{icon}</span> {label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2>Ton du message</h2>
          <div className={styles.grid}>
            {tones.map(({ label, icon }) => (
              <button
                key={label}
                className={`${styles.option} ${
                  selectedTone === label ? styles.selected : ""
                }`}
                onClick={() => setSelectedTone(label)}
              >
                <span>{icon}</span> {label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2>Ajouter des emojis ?</h2>
          <div className={styles.horizontalScroll}>
            <button
              className={`${styles.option} ${
                !withEmoji ? styles.selected : ""
              }`}
              onClick={() => setWithEmoji(false)}
            >
              📵 Sans emoji
            </button>
            <button
              className={`${styles.option} ${withEmoji ? styles.selected : ""}`}
              onClick={() => setWithEmoji(true)}
            >
              😀 Avec emoji
            </button>
          </div>
        </section>
      </div>
    </ScreenLayout>
  );
};

export default StyleCustomization;
