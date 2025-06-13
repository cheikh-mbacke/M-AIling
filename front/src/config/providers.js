// Configuration centralisée des providers email
export const EMAIL_PROVIDERS_CONFIG = {
  gmail: {
    id: "gmail",
    name: "Gmail",
    displayName: "Gmail",
    color: "#EA4335",
    oauth: {
      authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      scope: "https://www.googleapis.com/auth/gmail.readonly",
    },
    supportedFeatures: ["oauth", "labels", "filters"],
  },
  outlook: {
    id: "outlook",
    name: "Outlook",
    displayName: "Outlook",
    color: "#0078D4",
    oauth: {
      authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
      scope: "Mail.Read",
    },
    supportedFeatures: ["oauth", "folders"],
  },
  yahoo: {
    id: "yahoo",
    name: "Yahoo",
    displayName: "Yahoo Mail",
    color: "#6001D2",
    oauth: {
      authUrl: "https://api.login.yahoo.com/oauth2/request_auth",
      scope: "mail-r",
    },
    supportedFeatures: ["oauth", "folders"],
  },
  imap: {
    id: "imap",
    name: "IMAP",
    displayName: "Autre (IMAP)",
    color: "#666666",
    supportedFeatures: ["imap", "smtp"],
  },
};

// Helper pour obtenir la config d'un provider
export const getProviderConfig = (providerId) => {
  return (
    EMAIL_PROVIDERS_CONFIG[providerId?.toLowerCase()] ||
    EMAIL_PROVIDERS_CONFIG.imap
  );
};

// Liste des providers disponibles pour l'ajout
export const getAvailableProviders = () => {
  return Object.values(EMAIL_PROVIDERS_CONFIG);
};
