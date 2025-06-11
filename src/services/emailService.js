import { EMAIL_TEMPLATES } from "../utils";
import { extractKeyInfo, applyTemplate } from "../utils";
export const generateEmailVersions = (message, style) => {
  const templates = EMAIL_TEMPLATES[style] || EMAIL_TEMPLATES.professional;
  const { subject, details } = extractKeyInfo(message);

  return templates.map(({ template }) => {
    return applyTemplate(template, {
      SUBJECT: subject,
      DETAILS: details,
    });
  });
};

export const saveEmailHistory = (email) => {
  try {
    const history = getEmailHistory();
    const newEntry = {
      id: Date.now(),
      content: email,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [newEntry, ...history].slice(0, 50); // Garder 50 derniers
    localStorage.setItem(
      "emailAssistant_history",
      JSON.stringify(updatedHistory)
    );

    return true;
  } catch (error) {
    console.error("Erreur sauvegarde historique:", error);
    return false;
  }
};

export const getEmailHistory = () => {
  try {
    const history = localStorage.getItem("emailAssistant_history");
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Erreur lecture historique:", error);
    return [];
  }
};
