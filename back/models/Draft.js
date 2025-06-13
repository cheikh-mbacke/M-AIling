// ============================================================================
// 📁 models/Draft.js - Nouveau modèle à créer
// ============================================================================

const mongoose = require("mongoose");

const draftSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Brouillon sans titre",
    },
    originalMessage: {
      type: String,
      required: true,
    },
    reformulatedMessage: {
      type: String,
    },
    to: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Email invalide",
      },
    },
    subject: {
      type: String,
      maxLength: 200,
    },
    styleConfig: {
      language: {
        type: String,
        enum: ["FR", "EN", "ES", "DE", "IT", "PT", "NL", "RU", "ZH", "JA"],
        default: "FR",
      },
      tone: {
        type: String,
        enum: [
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
        default: "Professionnel",
      },
      length: {
        type: String,
        enum: ["Court", "Moyen", "Long"],
        default: "Moyen",
      },
      emoji: {
        type: Boolean,
        default: false,
      },
    },
    isReformulated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les requêtes
draftSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Draft", draftSchema);
