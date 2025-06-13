// ============================================================================
// 📁 routes/reformulate.js - Routes de reformulation
// ============================================================================

const express = require("express");
const router = express.Router();

const reformulateController = require("../controllers/reformulateController");
const { authenticateToken } = require("../middleware/auth");
const { validateReformulate } = require("../middleware/validation");
const { simpleRateLimit } = require("../middleware/rateLimiting");

// Route principale de reformulation
router.post(
  "/",
  authenticateToken,
  simpleRateLimit,
  validateReformulate,
  reformulateController.reformulateMessage
);

// Route pour récupérer les styles disponibles
router.get(
  "/styles",
  authenticateToken,
  reformulateController.getAvailableStyles
);

// Route de test (sans OpenAI)
router.post("/test", authenticateToken, reformulateController.testReformulate);

module.exports = router;
