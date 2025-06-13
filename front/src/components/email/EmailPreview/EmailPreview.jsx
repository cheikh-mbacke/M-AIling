import React, { useState, useEffect, useRef } from "react";
import styles from "./EmailPreview.module.css";
import Header from "../../common/Header/Header";
import Button from "../../common/Button/Button";
import ScreenLayout from "../../layout/ScreenLayout";
import { RefreshCw, Edit } from "lucide-react";

const EmailPreview = ({
  rawMessage,
  styleConfig,
  onBack,
  onNext,
  onModify,
}) => {
  const [reformulatedMessage, setReformulatedMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const textareaRef = useRef(null);

  // Détection du clavier virtuel
  useEffect(() => {
    const handleResize = () => {
      // Sur mobile, si la hauteur de viewport diminue significativement, c'est le clavier
      const viewportHeight =
        window.visualViewport?.height || window.innerHeight;
      const screenHeight = window.screen.height;
      const keyboardThreshold = 0.75; // Si viewport < 75% de l'écran, clavier ouvert

      setIsKeyboardOpen(viewportHeight < screenHeight * keyboardThreshold);
    };

    // Écouter les changements de taille de viewport
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    } else {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      } else {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  // Simulation d'une API de reformulation
  const generateReformulation = async () => {
    setIsLoading(true);

    // Simulation d'un délai d'API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulation basée sur le style sélectionné
    const mockReformulations = {
      Professionnel: `Madame, Monsieur,

J'espère que ce message vous trouve en bonne santé. Je me permets de vous contacter concernant ${rawMessage.toLowerCase()}.

Je reste à votre disposition pour tout complément d'information.

Cordialement,`,

      Amical: `Salut ! 😊

J'espère que tu vas bien ! Je voulais te parler de ${rawMessage.toLowerCase()}.

N'hésite pas si tu as des questions !

À bientôt,`,

      Familier: `Hey !

Alors, pour ${rawMessage.toLowerCase()}, voilà ce que je pense...

Dis-moi ce que tu en penses !

Bisous 😘`,

      Expert: `Bonjour,

Suite à mon analyse approfondie concernant ${rawMessage.toLowerCase()}, je peux vous confirmer que les éléments suivants méritent votre attention.

Cette approche optimisera significativement vos résultats.

Bien à vous,`,
    };

    const selectedTone = styleConfig?.tone || "Professionnel";
    const baseMessage =
      mockReformulations[selectedTone] || mockReformulations["Professionnel"];

    // Ajouter des emojis si demandé
    let finalMessage = baseMessage;
    if (styleConfig?.emoji) {
      const emojis = ["✨", "🎯", "💪", "🚀", "⭐"];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      finalMessage = finalMessage.replace(".", ` ${randomEmoji}.`);
    }

    setReformulatedMessage(finalMessage);
    setIsLoading(false);
  };

  useEffect(() => {
    generateReformulation();
  }, []);

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset la hauteur pour recalculer
      textarea.style.height = "auto";

      // Calculer la nouvelle hauteur avec limites adaptées au clavier
      const scrollHeight = textarea.scrollHeight;
      const minHeight = 200;
      const maxHeight = isKeyboardOpen ? 150 : 400; // Hauteur réduite si clavier ouvert

      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      textarea.style.height = newHeight + "px";

      // Si le contenu dépasse la hauteur max, activer le scroll
      if (scrollHeight > maxHeight) {
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.overflowY = "hidden";
      }
    }
  };

  // Recalculer la taille quand le statut du clavier change
  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        autoResize();
      }, 100);
    }
  }, [isKeyboardOpen]);

  // Ajuster la taille au moment de l'édition
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      setTimeout(() => {
        autoResize();
      }, 100);
    }
  }, [isEditing]);

  const handleRegenerate = () => {
    generateReformulation();
  };

  const handleModify = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Optionnel : restaurer le message original si besoin
  };

  return (
    <ScreenLayout
      header={<Header title="Aperçu du message" onBack={onBack} />}
      footer={
        <div className={styles.footer}>
          <Button
            onClick={() => onNext(reformulatedMessage)}
            fullWidth
            variant="primary"
          >
            Suivant
          </Button>
        </div>
      }
    >
      <div className={styles.container}>
        {/* Message reformulé */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Message reformulé</h3>
            <div className={styles.actionButtons}>
              {isEditing ? (
                <>
                  <button
                    className={styles.actionButton}
                    onClick={handleCancelEdit}
                    title="Annuler"
                  >
                    ✕
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={handleSaveEdit}
                    title="Sauvegarder"
                  >
                    ✓
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={styles.actionButton}
                    onClick={handleModify}
                    title="Modifier"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={handleRegenerate}
                    disabled={isLoading}
                    title="Régénérer"
                  >
                    <RefreshCw
                      size={18}
                      className={isLoading ? styles.spinning : ""}
                    />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className={styles.reformulatedMessage}>
            {isLoading ? (
              <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
                <span>Reformulation en cours...</span>
              </div>
            ) : isEditing ? (
              <textarea
                ref={textareaRef}
                value={reformulatedMessage}
                onChange={(e) => {
                  setReformulatedMessage(e.target.value);
                  autoResize();
                }}
                className={`${styles.editTextarea} ${
                  isKeyboardOpen ? styles.keyboardOpen : ""
                }`}
                autoFocus
              />
            ) : (
              <div className={styles.messageContent}>
                {reformulatedMessage.split("\n").map((line, index) => (
                  <p
                    key={index}
                    className={line.trim() === "" ? styles.emptyLine : ""}
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </ScreenLayout>
  );
};

export default EmailPreview;
