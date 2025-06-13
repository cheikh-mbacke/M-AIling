// ============================================================================
// 📁 controllers/reformulateController.js - Avec vraie IA OpenAI
// ============================================================================

const {
  reformulateMessage: reformulateWithAI,
} = require("../services/openaiService");

/**
 * Reformulation principale avec OpenAI
 */
const reformulateMessage = async (req, res) => {
  try {
    const { message, config } = req.body;
    const userId = req.user._id;

    console.log(
      `📝 Nouvelle demande de reformulation de l'utilisateur ${userId}`
    );
    console.log(`💬 Message original: "${message}"`);
    console.log(`⚙️ Configuration:`, config);

    // Appel au service OpenAI
    const result = await reformulateWithAI(message, config);

    console.log(`✅ Reformulation réussie pour l'utilisateur ${userId}`);

    res.json({
      reformulated: result.reformulated,
      metadata: {
        tokensUsed: result.metadata.tokensUsed,
        originalLength: message.length,
        reformulatedLength: result.reformulated.length,
        config: config,
        model: result.metadata.model,
      },
    });
  } catch (error) {
    console.error("❌ Erreur dans reformulateController:", error);

    // Gestion d'erreurs spécifiques
    if (error.message.includes("Quota OpenAI dépassé")) {
      return res.status(503).json({
        error: "Service temporairement indisponible",
        details: "Quota OpenAI dépassé. Veuillez réessayer plus tard.",
      });
    }

    if (error.message.includes("Trop de requêtes")) {
      return res.status(429).json({
        error: "Trop de demandes",
        details: "Veuillez patienter quelques secondes avant de réessayer.",
      });
    }

    if (error.message.includes("Clé API OpenAI invalide")) {
      return res.status(503).json({
        error: "Service temporairement indisponible",
        details: "Configuration du service de reformulation incorrecte.",
      });
    }

    // Erreur générique
    res.status(500).json({
      error: "Erreur lors de la reformulation",
      details:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Une erreur inattendue s'est produite.",
    });
  }
};

/**
 * Récupérer les styles disponibles
 */
const getAvailableStyles = (req, res) => {
  try {
    const { LANGUAGE_CONFIG } = require("../services/openaiService");

    const styles = {
      languages: [
        { code: "FR", name: "français" },
        { code: "EN", name: "anglais" },
        { code: "ES", name: "espagnol" },
        { code: "DE", name: "allemand" },
        { code: "IT", name: "italien" },
        { code: "PT", name: "portugais" },
        { code: "NL", name: "néerlandais" },
        { code: "RU", name: "russe" },
        { code: "ZH", name: "chinois" },
        { code: "JA", name: "japonais" },
      ],
      tones: [
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
      ],
      lengths: ["Court", "Moyen", "Long"],
    };

    res.json(styles);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des styles:", error);
    res.status(500).json({
      error: "Erreur serveur",
      details: "Impossible de récupérer les styles disponibles",
    });
  }
};

/**
 * Test de reformulation MOCK (pour développement)
 */
const testReformulate = (req, res) => {
  try {
    const { message, config } = req.body;

    if (!message || !config) {
      return res.status(400).json({
        error: "Données manquantes",
        details: "Message et configuration requis",
      });
    }

    // Mock simple pour tester
    const mockReformulations = {
      Professionnel: `Madame, Monsieur,\n\nJ'ai bien reçu votre message concernant : "${message}"\n\nJe vous remercie de votre attention.\n\nCordialement`,
      Amical: `Salut ! 😊\n\nTon message : "${message}"\n\nMerci et à bientôt !`,
      Formelle: `Madame, Monsieur,\n\nJ'ai l'honneur de vous faire savoir que votre message "${message}" a retenu toute mon attention.\n\nVeuillez agréer mes salutations distinguées.`,
    };

    const reformulated =
      mockReformulations[config.tone] || `[TEST - ${config.tone}] ${message}`;

    console.log(`🧪 Test de reformulation: ${config.tone}`);

    res.json({
      reformulated,
      metadata: {
        originalLength: message.length,
        reformulatedLength: reformulated.length,
        config,
        mode: "TEST",
      },
    });
  } catch (error) {
    console.error("❌ Erreur dans testReformulate:", error);
    res.status(500).json({
      error: "Erreur lors du test",
      details: "Une erreur s'est produite pendant le test de reformulation",
    });
  }
};

module.exports = {
  reformulateMessage,
  getAvailableStyles,
  testReformulate,
};
