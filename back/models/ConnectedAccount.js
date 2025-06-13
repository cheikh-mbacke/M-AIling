// ============================================================================
// 📁 models/ConnectedAccount.js - Modèle corrigé
// ============================================================================

const mongoose = require("mongoose");
const crypto = require("crypto");

// Configuration chiffrement
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // Clé de 32 octets en hexadécimal
const ALGORITHM = "aes-256-cbc";

const connectedAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: ["gmail", "outlook", "yahoo"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Email invalide",
      },
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    tokenExpiry: {
      type: Date,
      required: true,
    },
    profileId: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastUsed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index
connectedAccountSchema.index({ userId: 1, provider: 1 });
connectedAccountSchema.index({ userId: 1, isActive: 1 });

// 🔐 Méthodes de chiffrement/déchiffrement modernes

connectedAccountSchema.methods.encryptToken = function (token) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};

connectedAccountSchema.methods.decryptToken = function (encryptedToken) {
  const [ivHex, encrypted] = encryptedToken.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// Vérifie si le token est expiré
connectedAccountSchema.methods.isTokenExpired = function () {
  return new Date() >= this.tokenExpiry;
};

module.exports = mongoose.model("ConnectedAccount", connectedAccountSchema);
