// ============================================================================
// 📁 routes/accounts.js - Routes pour les comptes connectés
// ============================================================================

const express = require("express");
const router = express.Router();
const oauthSessionBridge = require("../middleware/oauthSessionBridge");

const accountsController = require("../controllers/accountsController");

// Routes OAuth spécifiques
router.get(
  "/oauth/gmail",
  oauthSessionBridge,
  accountsController.initiateGmailOAuth
);
router.get("/oauth/gmail/callback", accountsController.handleGmailCallback);

// Routes CRUD pour les comptes connectés
router.get("/", accountsController.getConnectedAccounts);
router.delete("/:id", accountsController.disconnectAccount);
router.get("/:id/emails", accountsController.getAccountEmails);

module.exports = router;
