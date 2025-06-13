// ============================================================================
// 📁 config/passport.js - Configuration Passport OAuth
// ============================================================================

require("dotenv").config();

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const ConnectedAccount = require("../models/ConnectedAccount");
const User = require("../models/User");

// Configuration Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/api/accounts/oauth/gmail/callback",
      scope: [
        "email",
        "profile",
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.readonly",
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(
          "🔐 Callback OAuth Google reçu pour:",
          profile.emails[0].value
        );

        // Les informations du profil Google
        const googleEmail = profile.emails[0].value;
        const profileData = {
          profileId: profile.id,
          email: googleEmail,
          displayName: profile.displayName,
          profilePicture: profile.photos[0]?.value,
          accessToken,
          refreshToken,
          tokenExpiry: new Date(Date.now() + 3600000), // 1 heure
        };

        return done(null, profileData);
      } catch (error) {
        console.error("❌ Erreur dans la stratégie Google:", error);
        return done(error, null);
      }
    }
  )
);

// Sérialisation pour les sessions (optionnel)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
