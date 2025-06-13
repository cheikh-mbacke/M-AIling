// ============================================================================
// 📁 server.js - MISE À JOUR pour utiliser le YAML
// ============================================================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("./config/passport");
require("dotenv").config();

// Import Swagger avec YAML
const {
  swaggerUi,
  swaggerDocument,
  swaggerOptions,
} = require("./config/swagger");

// Import des routes
const authRoutes = require("./routes/auth");
const reformulateRoutes = require("./routes/reformulate");
const draftsRoutes = require("./routes/drafts");
const accountsRoutes = require("./routes/accounts");

const app = express();

// ============================================================================
// Middlewares globaux
// ============================================================================

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:5500", // Live Server de VS Code
      "http://127.0.0.1:5173", // Vite
      "http://localhost:5173", // Vite
      "file://", // Fichiers HTML locaux
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logger simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ============================================================================
// Documentation Swagger
// ============================================================================

// Documentation API avec YAML
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions)
);

// Redirection vers la documentation
app.get("/docs", (req, res) => {
  res.redirect("/api-docs");
});

// Route pour télécharger le fichier YAML
app.get("/swagger.yaml", (req, res) => {
  res.sendFile(path.join(__dirname, "swagger.yaml"));
});

// ============================================================================
// Routes
// ============================================================================

app.use("/api/auth", authRoutes);
app.use("/api/reformulate", reformulateRoutes);
app.use("/api/drafts", draftsRoutes);
app.use("/api/accounts", accountsRoutes);

// Route de santé
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API M'ailing is running",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// Gestion des erreurs
// ============================================================================

app.use("*notfound", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// ============================================================================
// Connexion MongoDB et démarrage
// ============================================================================

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mailing")
  .then(() => {
    console.log("✅ Connecté à MongoDB");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📋 API disponible sur http://localhost:${PORT}/api`);
      console.log(
        `📚 Documentation Swagger: http://localhost:${PORT}/api-docs`
      );
      console.log(`📄 YAML spec: http://localhost:${PORT}/swagger.yaml`);
      console.log(`🔍 Test: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((error) => {
    console.error("❌ Erreur de connexion MongoDB:", error);
    process.exit(1);
  });
