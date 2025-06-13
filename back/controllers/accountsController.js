// ============================================================================
// 📁 controllers/accountsController.js - Contrôleur comptes connectés
// ============================================================================

const ConnectedAccount = require("../models/ConnectedAccount");
const passport = require("../config/passport");

/**
 * GET /api/accounts - Liste des comptes connectés
 */
const getConnectedAccounts = async (req, res) => {
  try {
    const userId = req.user._id;

    const accounts = await ConnectedAccount.find({
      userId,
      isActive: true,
    }).select("-accessToken -refreshToken -__v");

    console.log(
      `📧 Récupération de ${accounts.length} comptes pour l'utilisateur ${userId}`
    );

    res.json({
      accounts,
      total: accounts.length,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des comptes:", error);
    res.status(500).json({
      error: "Erreur serveur",
      details:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Impossible de récupérer les comptes",
    });
  }
};

/**
 * GET /api/accounts/oauth/gmail - Initier la connexion Gmail
 */
const initiateGmailOAuth = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      console.error("❌ Aucun userId trouvé en session pour OAuth Gmail");
      return res
        .status(401)
        .json({ error: "Utilisateur non authentifié pour OAuth" });
    }

    // Vérifie si un compte Gmail est déjà connecté
    const alreadyConnected = await ConnectedAccount.findOne({
      userId,
      provider: "gmail",
      isActive: true,
    });

    const oauthOptions = {
      scope: [
        "email",
        "profile",
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.readonly",
      ],
      accessType: "offline",
      ...(alreadyConnected ? {} : { prompt: "consent" }),
    };

    console.log("🔐 Options OAuth envoyées à Google :", oauthOptions);

    passport.authenticate("google", oauthOptions)(req, res, next);
  } catch (error) {
    console.error("❌ Erreur dans initiateGmailOAuth :", error);
    res.status(500).json({ error: "Erreur interne OAuth" });
  }
};
  

/**
 * GET /api/accounts/oauth/gmail/callback - Callback OAuth Gmail
 */
const handleGmailCallback = async (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false },
    async (err, profileData) => {
      try {
        if (err) {
          console.error("❌ Erreur OAuth:", err);
          return res.redirect(
            `${process.env.FRONTEND_URL}/accounts?error=oauth_error`
          );
        }

        if (!profileData) {
          console.error("❌ Pas de données de profil reçues");
          return res.redirect(
            `${process.env.FRONTEND_URL}/accounts?error=auth_failed`
          );
        }

        // Récupérer l'utilisateur depuis la session
        const userId = req.session.userId;
        if (!userId) {
          console.error("❌ Pas d'ID utilisateur en session");
          return res.redirect(
            `${process.env.FRONTEND_URL}/accounts?error=session_expired`
          );
        }

        // Vérifier si ce compte Gmail est déjà connecté
        const existingAccount = await ConnectedAccount.findOne({
          userId,
          provider: "gmail",
          email: profileData.email,
          isActive: true,
        });

        if (existingAccount) {
          console.log(`⚠️ Compte Gmail ${profileData.email} déjà connecté`);
          return res.redirect(
            `${process.env.FRONTEND_URL}/accounts?error=already_connected`
          );
        }

        // Créer le nouveau compte connecté
        const newAccount = new ConnectedAccount({
          userId,
          provider: "gmail",
          email: profileData.email,
          profileId: profileData.profileId,
          displayName: profileData.displayName,
          profilePicture: profileData.profilePicture,
          accessToken: profileData.accessToken, // Sera chiffré automatiquement
          refreshToken: profileData.refreshToken, // Sera chiffré automatiquement
          tokenExpiry: profileData.tokenExpiry,
        });

        //Vérification stricte avant chiffrement
        if (
          typeof profileData.accessToken !== "string" ||
          typeof profileData.refreshToken !== "string"
        ) {
          console.error(
            "❌ Les tokens OAuth sont invalides ou manquants :",
            profileData
          );
          return res.redirect(
            `${process.env.FRONTEND_URL}/accounts?error=invalid_token`
          );
        }

        // 🔐 Chiffrer les tokens après validation
        newAccount.accessToken = newAccount.encryptToken(
          profileData.accessToken
        );
        newAccount.refreshToken = newAccount.encryptToken(
          profileData.refreshToken
        );

        await newAccount.save();

        console.log(
          `✅ Compte Gmail ${profileData.email} connecté avec succès pour l'utilisateur ${userId}`
        );

        // Nettoyer la session
        delete req.session.userId;

        // Rediriger vers le frontend avec succès
        res.redirect(
          `${
            process.env.FRONTEND_URL
          }/accounts?success=gmail_connected&email=${encodeURIComponent(
            profileData.email
          )}`
        );
      } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde du compte:", error);
        res.redirect(`${process.env.FRONTEND_URL}/accounts?error=save_failed`);
      }
    }
  )(req, res, next);
};

/**
 * DELETE /api/accounts/:id - Déconnecter un compte
 */
const disconnectAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const accountId = req.params.id;

    const account = await ConnectedAccount.findOne({
      _id: accountId,
      userId,
      isActive: true,
    });

    if (!account) {
      return res.status(404).json({
        error: "Compte introuvable",
        details: "Ce compte n'existe pas ou ne vous appartient pas",
      });
    }

    // Marquer comme inactif au lieu de supprimer
    account.isActive = false;
    await account.save();

    console.log(
      `✅ Compte ${account.email} (${account.provider}) déconnecté pour l'utilisateur ${userId}`
    );

    res.json({
      message: "Compte déconnecté avec succès",
      disconnectedEmail: account.email,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la déconnexion du compte:", error);
    res.status(500).json({
      error: "Erreur lors de la déconnexion",
      details:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Impossible de déconnecter le compte",
    });
  }
};

/**
 * GET /api/accounts/:id/emails - Lister les adresses d'un compte (placeholder)
 */
const getAccountEmails = async (req, res) => {
  try {
    const userId = req.user._id;
    const accountId = req.params.id;

    const account = await ConnectedAccount.findOne({
      _id: accountId,
      userId,
      isActive: true,
    });

    if (!account) {
      return res.status(404).json({
        error: "Compte introuvable",
        details: "Ce compte n'existe pas ou ne vous appartient pas",
      });
    }

    // Pour l'instant, retourner juste l'email principal
    // Plus tard, on pourra utiliser l'API Gmail pour récupérer les alias
    res.json({
      emails: [
        {
          email: account.email,
          isPrimary: true,
          verified: true,
        },
      ],
      account: {
        provider: account.provider,
        displayName: account.displayName,
      },
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des emails:", error);
    res.status(500).json({
      error: "Erreur serveur",
      details:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Impossible de récupérer les emails",
    });
  }
};

module.exports = {
  getConnectedAccounts,
  initiateGmailOAuth,
  handleGmailCallback,
  disconnectAccount,
  getAccountEmails,
};
