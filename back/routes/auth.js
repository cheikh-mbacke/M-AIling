// ============================================================================
// 📁 routes/auth.js - Routes d'authentification
// ============================================================================

const express = require("express");
const router = express.Router();

// Import des contrôleurs et middlewares
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");
const { validateRegister, validateLogin } = require("../middleware/validation");

// Routes publiques
router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);

// Routes protégées
router.post("/logout", authenticateToken, authController.logout);
router.get("/me", authenticateToken, authController.getProfile);

module.exports = router;
