// ============================================================================
// 📁 services/openaiService.js - Service OpenAI
// ============================================================================

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration des prompts selon le style
const STYLE_PROMPTS = {
  Professionnel: {
    systemPrompt:
      "Tu es un assistant expert en communication professionnelle. Reformule les messages en utilisant un ton courtois, respectueux et adapté au milieu professionnel.",
    style: "professionnel et courtois",
  },
  Formelle: {
    systemPrompt:
      "Tu es un assistant expert en communication formelle. Reformule les messages en utilisant un registre soutenu et des formules de politesse appropriées.",
    style: "formel et respectueux",
  },
  Amical: {
    systemPrompt:
      "Tu es un assistant expert en communication amicale. Reformule les messages avec chaleur et bienveillance, tout en restant approprié.",
    style: "amical et chaleureux",
  },
  Familier: {
    systemPrompt:
      "Tu es un assistant expert en communication décontractée. Reformule les messages de manière naturelle et accessible.",
    style: "décontracté et naturel",
  },
  Expert: {
    systemPrompt:
      "Tu es un assistant expert en communication technique. Reformule les messages en utilisant un vocabulaire précis et une approche analytique.",
    style: "expert et technique",
  },
  Confiant: {
    systemPrompt:
      "Tu es un assistant expert en communication assertive. Reformule les messages avec assurance et détermination.",
    style: "confiant et assertif",
  },
  Aimant: {
    systemPrompt:
      "Tu es un assistant expert en communication affectueuse. Reformule les messages avec tendresse et attention.",
    style: "tendre et affectueux",
  },
  Prudent: {
    systemPrompt:
      "Tu es un assistant expert en communication mesurée. Reformule les messages avec nuance et précaution.",
    style: "prudent et mesuré",
  },
  Affligeant: {
    systemPrompt:
      "Tu es un assistant expert en communication empathique. Reformule les messages avec compassion et compréhension.",
    style: "compatissant et empathique",
  },
  Excitant: {
    systemPrompt:
      "Tu es un assistant expert en communication enthousiaste. Reformule les messages avec énergie et dynamisme.",
    style: "enthousiaste et dynamique",
  },
  Inspirant: {
    systemPrompt:
      "Tu es un assistant expert en communication motivante. Reformule les messages de manière à inspirer et encourager.",
    style: "inspirant et motivant",
  },
  Informatif: {
    systemPrompt:
      "Tu es un assistant expert en communication claire. Reformule les messages de manière factuelle et structurée.",
    style: "informatif et clair",
  },
  Direct: {
    systemPrompt:
      "Tu es un assistant expert en communication directe. Reformule les messages de manière concise et sans détour.",
    style: "direct et concis",
  },
  Attentionné: {
    systemPrompt:
      "Tu es un assistant expert en communication bienveillante. Reformule les messages avec attention et sollicitude.",
    style: "attentionné et bienveillant",
  },
  Surprise: {
    systemPrompt:
      "Tu es un assistant expert en communication captivante. Reformule les messages de manière à surprendre positivement.",
    style: "surprenant et captivant",
  },
  Persuasif: {
    systemPrompt:
      "Tu es un assistant expert en communication convaincante. Reformule les messages de manière à persuader efficacement.",
    style: "persuasif et convaincant",
  },
  Joyeux: {
    systemPrompt:
      "Tu es un assistant expert en communication joyeuse. Reformule les messages avec gaieté et positivité.",
    style: "joyeux et positif",
  },
};

// Configuration des longueurs
const LENGTH_CONFIG = {
  Court: {
    instruction: "Sois concis et va droit au but. Maximum 3-4 phrases.",
    maxTokens: 150,
  },
  Moyen: {
    instruction: "Développe modérément le message. 4-6 phrases environ.",
    maxTokens: 300,
  },
  Long: {
    instruction:
      "Développe le message de manière détaillée et complète. 6-10 phrases.",
    maxTokens: 500,
  },
};

// Configuration des langues
const LANGUAGE_CONFIG = {
  FR: "français",
  EN: "anglais",
  ES: "espagnol",
  DE: "allemand",
  IT: "italien",
  PT: "portugais",
  NL: "néerlandais",
  RU: "russe",
  ZH: "chinois",
  JA: "japonais",
};

/**
 * Construit le prompt complet pour OpenAI
 */
const buildPrompt = (message, config) => {
  const styleConfig =
    STYLE_PROMPTS[config.tone] || STYLE_PROMPTS["Professionnel"];
  const lengthConfig = LENGTH_CONFIG[config.length] || LENGTH_CONFIG["Moyen"];
  const language = LANGUAGE_CONFIG[config.language] || "français";

  const emojiInstruction = config.emoji
    ? "Tu peux ajouter quelques emojis appropriés pour rendre le message plus expressif."
    : "N'utilise aucun emoji dans ta reformulation.";

  return `${styleConfig.systemPrompt}

CONSIGNES SPÉCIFIQUES :
- Langue de sortie : ${language}
- Style : ${styleConfig.style}
- Longueur : ${lengthConfig.instruction}
- Emojis : ${emojiInstruction}

MESSAGE À REFORMULER :
"${message}"

INSTRUCTIONS :
1. Reformule ce message en respectant exactement le style et la longueur demandés
2. Garde le sens et l'intention originale
3. Adapte le niveau de langage au style choisi
4. Assure-toi que le message reformulé soit approprié pour un email
5. Ne commence pas par "Voici la reformulation" ou des phrases similaires, donne directement le message reformulé

REFORMULATION :`;
};

/**
 * Appel à l'API OpenAI pour reformuler un message
 */
const reformulateMessage = async (message, config) => {
  try {
    if (!message || message.trim().length === 0) {
      throw new Error("Le message à reformuler ne peut pas être vide");
    }

    // Vérifier que le ton existe
    if (!STYLE_PROMPTS[config.tone]) {
      throw new Error(`Ton invalide: ${config.tone}`);
    }

    // Construire le prompt
    const prompt = buildPrompt(message, config);
    const lengthConfig = LENGTH_CONFIG[config.length] || LENGTH_CONFIG["Moyen"];

    console.log("🤖 Reformulation en cours...", {
      originalLength: message.length,
      tone: config.tone,
      length: config.length,
      language: config.language,
      emoji: config.emoji,
    });

    // Appel à OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: lengthConfig.maxTokens,
      temperature: 0.7, // Un peu de créativité mais pas trop
      top_p: 0.9,
      frequency_penalty: 0.1, // Éviter les répétitions
      presence_penalty: 0.1,
    });

    const reformulatedText = completion.choices[0].message.content.trim();

    // Vérifier que la réponse n'est pas vide
    if (!reformulatedText) {
      throw new Error("La reformulation a échoué - réponse vide");
    }

    console.log("✅ Reformulation réussie", {
      originalLength: message.length,
      reformulatedLength: reformulatedText.length,
      tokensUsed: completion.usage.total_tokens,
    });

    return {
      reformulated: reformulatedText,
      metadata: {
        originalMessage: message,
        config: config,
        tokensUsed: completion.usage.total_tokens,
        model: "gpt-3.5-turbo",
      },
    };
  } catch (error) {
    console.error("❌ Erreur lors de la reformulation:", error);

    // Gestion des erreurs spécifiques OpenAI
    if (error.code === "insufficient_quota") {
      throw new Error("Quota OpenAI dépassé. Veuillez réessayer plus tard.");
    }

    if (error.code === "rate_limit_exceeded") {
      throw new Error(
        "Trop de requêtes. Veuillez patienter quelques secondes."
      );
    }

    if (error.code === "invalid_api_key") {
      throw new Error("Clé API OpenAI invalide.");
    }

    // Erreur générique
    throw new Error(`Erreur lors de la reformulation: ${error.message}`);
  }
};

module.exports = {
  reformulateMessage,
  STYLE_PROMPTS,
  LENGTH_CONFIG,
  LANGUAGE_CONFIG,
};
