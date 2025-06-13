import React, { useState } from "react";
import Dashboard from "./components/dashboard/Dashboard";
import FreeWriting from "./components/email/FreeWriting/FreeWriting";
import StyleCustomization from "./components/email/StyleCustomization/StyleCustomization";
import EmailPreview from "./components/email/EmailPreview/EmailPreview";
import EmailSend from "./components/email/EmailSend/EmailSend";
import EmailSuccess from "./components/email/EmailSuccess/EmailSuccess";

function App() {
  const [screen, setScreen] = useState("dashboard");
  const [rawMessage, setRawMessage] = useState("");
  const [styleConfig, setStyleConfig] = useState(null);
  const [finalMessage, setFinalMessage] = useState("");
  const [sentEmailData, setSentEmailData] = useState(null);

  const handleModifyMessage = (message) => {
    // Pour l'instant, on peut retourner à l'écran de rédaction avec le message reformulé
    setRawMessage(message);
    setScreen("write");
  };

  const handleSendEmail = (emailData) => {
    console.log("📧 Email envoyé :", emailData);
    setSentEmailData(emailData);
    setScreen("success");
  };

  const handleNewEmail = () => {
    // Reset tous les états pour un nouveau message
    setRawMessage("");
    setStyleConfig(null);
    setFinalMessage("");
    setSentEmailData(null);
    setScreen("write");
  };

  const handleBackToDashboard = () => {
    // Reset tous les états et retour au dashboard
    setRawMessage("");
    setStyleConfig(null);
    setFinalMessage("");
    setSentEmailData(null);
    setScreen("dashboard");
  };

  return (
    <div className="app">
      {screen === "dashboard" && (
        <Dashboard onCompose={() => setScreen("write")} />
      )}

      {screen === "write" && (
        <FreeWriting
          onBack={() => setScreen("dashboard")}
          onNext={(message) => {
            setRawMessage(message);
            setScreen("style");
          }}
        />
      )}

      {screen === "style" && (
        <StyleCustomization
          onBack={() => setScreen("write")}
          onNext={(config) => {
            setStyleConfig(config);
            setScreen("preview");
          }}
        />
      )}

      {screen === "preview" && (
        <EmailPreview
          rawMessage={rawMessage}
          styleConfig={styleConfig}
          onBack={() => setScreen("style")}
          onNext={(message) => {
            setFinalMessage(message);
            setScreen("send");
          }}
          onModify={handleModifyMessage}
        />
      )}

      {screen === "send" && (
        <EmailSend
          finalMessage={finalMessage}
          onBack={() => setScreen("preview")}
          onSend={handleSendEmail}
        />
      )}

      {screen === "success" && (
        <EmailSuccess
          emailData={sentEmailData}
          onNewEmail={handleNewEmail}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;
