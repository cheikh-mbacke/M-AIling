// ============================================================================
// 📁 middleware/validation.js - Validation des données
// ============================================================================

const validateRegister = (req, res, next) => {
  const { email, password, name } = req.body;
  const errors = [];

  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push("Email invalide");
  }
  if (!password || password.length < 6) {
    errors.push("Mot de passe requis (minimum 6 caractères)");
  }
  if (!name || name.trim().length === 0) {
    errors.push("Nom requis");
  }

  if (errors.length > 0) {
    return res
      .status(400)
      .json({ error: "Données invalides", details: errors });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }
  next();
};

const validateReformulate = (req, res, next) => {
  const { message, config } = req.body;
  const errors = [];

  // Validation du message
  if (!message) {
    errors.push("Le message à reformuler est requis");
  } else if (typeof message !== "string") {
    errors.push("Le message doit être une chaîne de caractères");
  } else if (message.trim().length === 0) {
    errors.push("Le message ne peut pas être vide");
  } else if (message.length > 5000) {
    errors.push("Le message ne peut pas dépasser 5000 caractères");
  }

  // Validation de la configuration
  if (!config) {
    errors.push("La configuration de style est requise");
  } else {
    const { language, tone, length, emoji } = config;

    const validLanguages = [
      "FR",
      "EN",
      "ES",
      "DE",
      "IT",
      "PT",
      "NL",
      "RU",
      "ZH",
      "JA",
    ];
    if (!language || !validLanguages.includes(language)) {
      errors.push("Langue invalide");
    }

    const validTones = [
      "Professionnel",
      "Formelle",
      "Amical",
      "Familier",
      "Expert",
      "Confiant",
      "Aimant",
      "Prudent",
      "Affligeant",
      "Excitant",
      "Inspirant",
      "Informatif",
      "Direct",
      "Attentionné",
      "Surprise",
      "Persuasif",
      "Joyeux",
    ];
    if (!tone || !validTones.includes(tone)) {
      errors.push("Ton invalide");
    }

    const validLengths = ["Court", "Moyen", "Long"];
    if (!length || !validLengths.includes(length)) {
      errors.push("Longueur invalide");
    }

    if (emoji !== undefined && typeof emoji !== "boolean") {
      errors.push("Le paramètre emoji doit être un booléen");
    }
  }

  if (errors.length > 0) {
    return res
      .status(400)
      .json({ error: "Données invalides", details: errors });
  }

  next();
};

const validateDraft = (req, res, next) => {
  const { originalMessage, to, subject } = req.body;

  // Message original requis
  if (!originalMessage || typeof originalMessage !== "string") {
    return res.status(400).json({
      error: "Message requis",
      details: "Le message original est obligatoire",
    });
  }

  if (originalMessage.trim().length === 0) {
    return res.status(400).json({
      error: "Message vide",
      details: "Le message ne peut pas être vide",
    });
  }

  if (originalMessage.length > 5000) {
    return res.status(400).json({
      error: "Message trop long",
      details: "Le message ne peut pas dépasser 5000 caractères",
    });
  }

  // Validation de l'email (optionnel)
  if (to && to.trim().length > 0) {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        error: "Email invalide",
        details: "Le format de l'email destinataire n'est pas valide",
      });
    }
  }

  // Validation du sujet (optionnel)
  if (subject && subject.length > 200) {
    return res.status(400).json({
      error: "Sujet trop long",
      details: "Le sujet ne peut pas dépasser 200 caractères",
    });
  }

  next();
};


module.exports = {
  validateRegister,
  validateLogin,
  validateReformulate,
  validateDraft,
};
