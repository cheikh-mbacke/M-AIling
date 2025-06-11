import React, { useState } from "react";
import {
  Header,
  EmailComposer,
  StyleSelector,
  GeneratedVersions,
  ActionBar,
} from "./components";
import { useEmailGenerator, useLocalStorage } from "./hooks";
import styles from "./App.module.css";

function App() {
  const [originalMessage, setOriginalMessage] = useLocalStorage("draft", "");
  const [selectedStyle, setSelectedStyle] = useState("professional");
  const [selectedVersion, setSelectedVersion] = useState(null);

  const { generatedVersions, isGenerating, generateVersions, error, setGeneratedVersions } =
    useEmailGenerator();

  const handleGenerate = () => {
    if (originalMessage.trim()) {
      generateVersions(originalMessage, selectedStyle);
      setSelectedVersion(null);
    }
  };

  const handleSend = () => {
    if (selectedVersion !== null && generatedVersions[selectedVersion]) {
      console.log("Envoi email:", generatedVersions[selectedVersion]);
      alert("Email envoyé ! (simulation)");
    }
  };

  const handleEdit = () => {
    if (selectedVersion !== null && generatedVersions[selectedVersion]) {
      setOriginalMessage(generatedVersions[selectedVersion]);
      setGeneratedVersions([]);
      setSelectedVersion(null);
    }
  };

  return (
    <div className={styles.app}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <EmailComposer
            value={originalMessage}
            onChange={setOriginalMessage}
            onGenerate={handleGenerate}
          />

          <StyleSelector
            selectedStyle={selectedStyle}
            onStyleChange={setSelectedStyle}
          />

          <button
            onClick={handleGenerate}
            disabled={!originalMessage.trim() || isGenerating}
            className={styles.generateButton}
          >
            {isGenerating ? "Génération en cours..." : "Générer les versions"}
          </button>

          {error && <div className={styles.error}>{error}</div>}

          {generatedVersions.length > 0 && (
            <GeneratedVersions
              versions={generatedVersions}
              selectedVersion={selectedVersion}
              onSelectVersion={setSelectedVersion}
            />
          )}
        </div>
      </main>

      {selectedVersion !== null && (
        <ActionBar onEdit={handleEdit} onSend={handleSend} />
      )}
    </div>
  );
}

export default App;
