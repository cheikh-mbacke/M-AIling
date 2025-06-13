// ============================================================================
// 📁 routes/drafts.js - Nouvelles routes à créer
// ============================================================================

const express = require("express");
const router = express.Router();

const draftsController = require("../controllers/draftsController");
const { authenticateToken } = require("../middleware/auth");
const { simpleRateLimit } = require("../middleware/rateLimiting");

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Routes CRUD pour les brouillons
router.get("/", draftsController.getDrafts);
router.post("/", simpleRateLimit, draftsController.createDraft);
router.put("/:id", draftsController.updateDraft);
router.delete("/:id", draftsController.deleteDraft);

// Route spéciale pour reformuler un brouillon
router.post(
  "/:id/reformulate",
  simpleRateLimit,
  draftsController.reformulateDraft
);

module.exports = router;
