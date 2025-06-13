import React, { useState } from "react";
import styles from "./EmailSend.module.css";
import Header from "../../common/Header/Header";
import Button from "../../common/Button/Button";
import ScreenLayout from "../../layout/ScreenLayout";
import { ChevronDown, Paperclip, Mail } from "lucide-react";

// Mock des comptes connectés
const connectedAccounts = [
  { id: "gmail", name: "Gmail", email: "john.doe@gmail.com", icon: "📧" },
  { id: "outlook", name: "Outlook", email: "john.doe@outlook.com", icon: "📬" },
  { id: "yahoo", name: "Yahoo Mail", email: "john.doe@yahoo.com", icon: "📮" },
];

const EmailSend = ({ finalMessage, onBack, onSend }) => {
  const [selectedAccount, setSelectedAccount] = useState(connectedAccounts[0]);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [fromEmail, setFromEmail] = useState(selectedAccount.email);
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const handleAccountChange = (account) => {
    setSelectedAccount(account);
    setFromEmail(account.email);
    setShowAccountDropdown(false);
  };

  const handleAttachment = () => {
    // Simulation d'ajout de fichier
    const newFile = { name: "document.pdf", size: "2.4 MB" };
    setAttachments([...attachments, newFile]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!toEmail.trim() || !subject.trim()) {
      alert("Veuillez remplir le destinataire et l'objet");
      return;
    }

    setIsSending(true);

    // Simulation d'envoi
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const emailData = {
      from: fromEmail,
      to: toEmail,
      subject: subject,
      message: finalMessage,
      attachments: attachments,
      account: selectedAccount,
    };

    onSend?.(emailData);
    setIsSending(false);
  };

  const generateSubject = () => {
    // Génération automatique d'objet basée sur le contenu
    const words = finalMessage.split(" ").slice(0, 5);
    const autoSubject = words.join(" ") + (words.length >= 5 ? "..." : "");
    setSubject(autoSubject);
  };

  return (
    <ScreenLayout
      header={<Header title="Envoyer le mail" onBack={onBack} />}
      footer={
        <div className={styles.footer}>
          <Button
            onClick={handleSend}
            fullWidth
            variant="primary"
            disabled={isSending || !toEmail.trim() || !subject.trim()}
          >
            {isSending ? (
              <div className={styles.sendingState}>
                <div className={styles.spinner}></div>
                Envoi en cours...
              </div>
            ) : (
              <>
                <Mail size={20} />
                Envoyer
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className={styles.container}>
        {/* Sélection du compte */}
        <div className={styles.field}>
          <label className={styles.label}>Compte</label>
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownButton}
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            >
              <div className={styles.accountInfo}>
                <span className={styles.accountIcon}>
                  {selectedAccount.icon}
                </span>
                <div className={styles.accountDetails}>
                  <span className={styles.accountName}>
                    {selectedAccount.name}
                  </span>
                  <span className={styles.accountEmail}>
                    {selectedAccount.email}
                  </span>
                </div>
              </div>
              <ChevronDown
                size={20}
                className={showAccountDropdown ? styles.rotated : ""}
              />
            </button>

            {showAccountDropdown && (
              <div className={styles.dropdownMenu}>
                {connectedAccounts.map((account) => (
                  <button
                    key={account.id}
                    className={styles.dropdownItem}
                    onClick={() => handleAccountChange(account)}
                  >
                    <div className={styles.accountInfo}>
                      <span className={styles.accountIcon}>{account.icon}</span>
                      <div className={styles.accountDetails}>
                        <span className={styles.accountName}>
                          {account.name}
                        </span>
                        <span className={styles.accountEmail}>
                          {account.email}
                        </span>
                      </div>
                    </div>
                    {selectedAccount.id === account.id && (
                      <span className={styles.checkmark}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* De (lecture seule) */}
        <div className={styles.field}>
          <label className={styles.label}>De</label>
          <div className={styles.readOnlyField}>{fromEmail}</div>
        </div>

        {/* À */}
        <div className={styles.field}>
          <label className={styles.label}>À</label>
          <input
            type="email"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            placeholder="destinataire@exemple.com"
            className={styles.input}
          />
        </div>

        {/* Objet */}
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Objet</label>
            <button
              className={styles.generateButton}
              onClick={generateSubject}
              type="button"
            >
              ✨ Auto
            </button>
          </div>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Objet du message"
            className={styles.input}
          />
        </div>

        {/* Aperçu du message */}
        <div className={styles.field}>
          <label className={styles.label}>Message</label>
          <div className={styles.messagePreview}>
            {finalMessage
              .split("\n")
              .slice(0, 3)
              .map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            {finalMessage.split("\n").length > 3 && (
              <p className={styles.truncated}>...</p>
            )}
          </div>
        </div>

        {/* Pièces jointes */}
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Pièces jointes</label>
            <button
              className={styles.attachButton}
              onClick={handleAttachment}
              type="button"
            >
              <Paperclip size={16} />
              Joindre un fichier
            </button>
          </div>

          {attachments.length > 0 && (
            <div className={styles.attachmentsList}>
              {attachments.map((file, index) => (
                <div key={index} className={styles.attachment}>
                  <div className={styles.attachmentInfo}>
                    <span className={styles.attachmentName}>{file.name}</span>
                    <span className={styles.attachmentSize}>{file.size}</span>
                  </div>
                  <button
                    className={styles.removeAttachment}
                    onClick={() => removeAttachment(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ScreenLayout>
  );
};

export default EmailSend;
