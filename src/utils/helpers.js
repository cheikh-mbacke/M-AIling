export const extractKeyInfo = (message) => {
  // Extraction simple du sujet et des détails
  const lines = message.trim().split("\n");
  const subject = lines[0] || message.substring(0, 50);
  const details = lines.slice(1).join("\n") || message;

  return { subject, details };
};

export const applyTemplate = (template, variables) => {
  let result = template;

  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{${key}}`, "g");
    result = result.replace(regex, variables[key]);
  });

  return result;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Erreur lors de la copie:", err);
    return false;
  }
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
