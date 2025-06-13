# API M'ailing - Spécifications Backend (Simplifiée)

## 🎯 Vue d'ensemble
Backend Node.js/Express pour l'assistant de rédaction d'e-mails multistyle.

## 📋 Fonctionnalités principales

### 1. Authentification & Gestion Utilisateurs
```
POST /auth/register     - Inscription utilisateur (email/mot de passe)
POST /auth/login        - Connexion
POST /auth/logout       - Déconnexion
GET  /auth/me          - Profil utilisateur
```

### 2. Gestion des Comptes E-mail
```
GET    /accounts               - Liste des comptes connectés
POST   /accounts/oauth/{provider} - Connexion OAuth (Gmail, Outlook, etc.)
DELETE /accounts/{id}          - Déconnecter un compte
GET    /accounts/{id}/emails   - Lister les adresses d'un compte
```

### 3. Reformulation IA (Cœur du système)
```
POST /reformulate - Reformuler un message
Body: {
  "message": "texte original",
  "config": {
    "language": "FR",
    "tone": "Professionnel", 
    "length": "Moyen",
    "emoji": true
  }
}
Response: {
  "reformulated": "message reformulé"
}
```

### 4. Envoi d'E-mails
```
POST /send - Envoyer un e-mail
Body: {
  "from": "email@domain.com",
  "to": "destinataire@domain.com", 
  "subject": "Objet",
  "message": "Corps du message",
  "attachments": [...],
  "accountId": "compte_source"
}
```

### 5. Brouillons
```
GET    /drafts         - Liste des brouillons
POST   /drafts         - Sauvegarder brouillon
PUT    /drafts/{id}    - Modifier brouillon
DELETE /drafts/{id}    - Supprimer brouillon
```

## 🛠 Stack Technique

### Core
- **Node.js** + **Express.js**
- **JavaScript** (pas de TypeScript)
- **MongoDB** pour la base de données

### Authentification
- **Passport.js** pour OAuth (Google, Microsoft, Yahoo)
- **JWT** pour les sessions
- **bcrypt** pour hasher les mots de passe

### IA & Reformulation
- **OpenAI API** (GPT-4/3.5)
- Prompts personnalisés selon le style choisi

### E-mail
- **Nodemailer** pour SMTP
- **Gmail API**, **Microsoft Graph API** pour intégrations
- **Multer** pour gestion des pièces jointes

### Sécurité & Performance
- **Helmet.js** pour sécuriser Express
- **Rate limiting** avec express-rate-limit
- **CORS** configuré
- **Compression** gzip
- **Morgan** pour les logs

## 🗃 Structure de Base de Données

### Users
```javascript
{
  _id: ObjectId,
  email: String,
  password: String, // hashé avec bcrypt
  name: String,
  createdAt: Date
}
```

### ConnectedAccounts
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  provider: String, // "gmail", "outlook", etc.
  email: String,
  accessToken: String, // chiffré
  refreshToken: String, // chiffré
  tokenExpiry: Date,
  isActive: Boolean,
  createdAt: Date
}
```

### Drafts
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  content: String,
  styleConfig: {
    language: String,
    tone: String,
    length: String,
    emoji: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Sécurité

### Authentification Simple
- Inscription directe avec email/mot de passe
- Pas de confirmation par e-mail
- Hachage bcrypt des mots de passe
- JWT pour maintenir les sessions

### OAuth Flow
1. Frontend redirige vers `/auth/oauth/gmail`
2. Callback OAuth traité par le backend
3. Tokens stockés chiffrés en base
4. Liaison automatique avec l'utilisateur connecté

### Protection des Données
- Chiffrement des tokens OAuth
- Validation stricte des inputs
- Rate limiting par utilisateur (10 reformulations/minute)
- Sanitisation des données d'entrée

## 🤖 Intégration OpenAI

### Configuration
```javascript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
```

### Prompts par Style
```javascript
const PROMPTS = {
  "Professionnel": "Reformule ce message de manière professionnelle et courtoise...",
  "Familier": "Reformule ce message de manière décontractée et amicale...",
  "Amical": "Reformule ce message avec un ton chaleureux et bienveillant...",
  // etc.
};
```

### Endpoint de Reformulation
```javascript
app.post('/reformulate', async (req, res) => {
  const { message, config } = req.body;
  
  const prompt = buildPrompt(message, config);
  
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
    temperature: 0.7
  });
  
  res.json({
    reformulated: completion.choices[0].message.content
  });
});
```

## 🚀 Structure du Projet

```
/api-mailing
├── /controllers
│   ├── authController.js
│   ├── accountsController.js
│   ├── reformulateController.js
│   ├── sendController.js
│   └── draftsController.js
├── /models
│   ├── User.js
│   ├── ConnectedAccount.js
│   └── Draft.js
├── /routes
│   ├── auth.js
│   ├── accounts.js
│   ├── reformulate.js
│   ├── send.js
│   └── drafts.js
├── /middleware
│   ├── auth.js
│   ├── validation.js
│   └── rateLimiting.js
├── /services
│   ├── openaiService.js
│   ├── emailService.js
│   └── oauthService.js
├── /config
│   ├── database.js
│   ├── passport.js
│   └── oauth.js
├── server.js
└── .env
```

## 🔄 Variables d'environnement

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mailing
JWT_SECRET=your_super_secret_key
OPENAI_API_KEY=sk-...

# OAuth Gmail
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...

# OAuth Outlook
OUTLOOK_CLIENT_ID=...
OUTLOOK_CLIENT_SECRET=...

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## 📦 Dependencies principales

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.0.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "passport": "^0.6.0",
    "passport-google-oauth20": "^2.0.0",
    "passport-microsoft": "^1.0.0",
    "openai": "^4.0.0",
    "nodemailer": "^6.9.0",
    "multer": "^1.4.5",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^6.7.0",
    "compression": "^1.7.4",
    "morgan": "^1.10.0",
    "dotenv": "^16.0.0"
  }
}
```

## 🎯 Ordre de Développement

1. **Setup de base** - Express + MongoDB + JWT Auth
2. **Reformulation IA** - Intégration OpenAI avec prompts
3. **OAuth Gmail** - Connexion et envoi via Gmail API
4. **Gestion des brouillons** - CRUD simple
5. **OAuth Outlook/Yahoo** - Élargir les options
6. **Optimisations** - Rate limiting, validation, sécurité

Cette version simplifiée se concentre sur l'essentiel pour une MVP fonctionnelle ! 🚀