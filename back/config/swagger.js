// ============================================================================
// 📁 config/swagger.js - Configuration Swagger avec YAML
// ============================================================================

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

// Charger le fichier YAML
const swaggerDocument = YAML.load(path.join(__dirname, "../swagger.yaml"));

// Configuration de l'interface Swagger
const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #2c3e50; }
    .swagger-ui .scheme-container { background: #f8f9fa; padding: 10px; border-radius: 5px; }
  `,
  customSiteTitle: "M'ailing API Documentation",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true, // Garde l'authentification
    displayRequestDuration: true, // Affiche la durée des requêtes
    tryItOutEnabled: true, // Active "Try it out" par défaut
    filter: true, // Active le filtre de recherche
    defaultModelsExpandDepth: 2, // Expansion des modèles
    defaultModelExpandDepth: 2,
  },
};

module.exports = {
  swaggerUi,
  swaggerDocument,
  swaggerOptions,
};
