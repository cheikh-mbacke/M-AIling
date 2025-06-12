import React, { useState } from "react";
import Dashboard from "./components/dashboard/Dashboard";
import FreeWriting from "./components/email/FreeWriting/FreeWriting";
import StyleCustomization from "./components/email/StyleCustomization/StyleCustomization";

function App() {
  const [screen, setScreen] = useState("dashboard");
  const [rawMessage, setRawMessage] = useState("");
  const [styleConfig, setStyleConfig] = useState(null);

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
            console.log("➡️ Message brut :", rawMessage);
            console.log("🎨 Style sélectionné :", config);
            // Ici : rediriger vers écran de génération
          }}
        />
      )}

    </div>
  );
}

export default App;
