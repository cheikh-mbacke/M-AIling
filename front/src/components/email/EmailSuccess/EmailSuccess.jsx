import React, { useEffect, useState } from "react";
import styles from "./EmailSuccess.module.css";
import Button from "../../common/Button/Button";
import ScreenLayout from "../../layout/ScreenLayout";
import { CheckCircle2, Mail, RotateCcw } from "lucide-react";

const EmailSuccess = ({ emailData, onNewEmail, onBackToDashboard }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Masquer les confettis après l'animation
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    // Forcer le scroll vers le haut au chargement
    window.scrollTo(0, 0);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = () => {
    return new Date().toLocaleString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.fullscreenContainer}>
      <div className={styles.container}>
        {/* Animation de confettis */}
        {showConfetti && (
          <div className={styles.confetti}>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={styles.confettiPiece}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: [
                    "#ff6b6b",
                    "#4ecdc4",
                    "#45b7d1",
                    "#96ceb4",
                    "#ffeaa7",
                  ][Math.floor(Math.random() * 5)],
                }}
              ></div>
            ))}
          </div>
        )}

        {/* Icône de succès */}
        <div className={styles.successIcon}>
          <CheckCircle2 size={80} className={styles.checkIcon} />
          <div className={styles.iconBackground}></div>
        </div>

        {/* Message principal */}
        <div className={styles.messageSection}>
          <h1 className={styles.title}>Email envoyé ! 🎉</h1>
          <p className={styles.subtitle}>
            Votre message a été envoyé avec succès
          </p>
        </div>

        {/* Détails de l'envoi */}
        <div className={styles.detailsCard}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>À :</span>
            <span className={styles.detailValue}>{emailData?.to}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>De :</span>
            <span className={styles.detailValue}>
              {emailData?.account?.name} ({emailData?.from})
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Objet :</span>
            <span className={styles.detailValue}>{emailData?.subject}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Envoyé le :</span>
            <span className={styles.detailValue}>{formatDate()}</span>
          </div>

          {emailData?.attachments?.length > 0 && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Pièces jointes :</span>
              <span className={styles.detailValue}>
                {emailData.attachments.length} fichier
                {emailData.attachments.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            onClick={onNewEmail}
            variant="secondary"
            fullWidth
            className={styles.actionButton}
          >
            <Mail size={20} />
            Nouveau message
          </Button>

          <Button
            onClick={onBackToDashboard}
            variant="primary"
            fullWidth
            className={styles.actionButton}
          >
            <RotateCcw size={20} />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailSuccess;
