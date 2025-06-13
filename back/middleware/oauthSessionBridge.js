const jwt = require("jsonwebtoken");

const oauthSessionBridge = (req, res, next) => {
  try {
    const token = req.query.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token JWT requis" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.session.userId = decoded.userId;

    console.log(
      "🧩 Session OAuth préparée pour l'utilisateur :",
      decoded.userId
    );
    next();
  } catch (error) {
    console.error("❌ Erreur JWT pour OAuth:", error.message);
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
};

module.exports = oauthSessionBridge;
