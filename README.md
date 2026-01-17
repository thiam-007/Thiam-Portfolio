# Portfolio Cheick Ahmed Thiam

Portfolio personnel dynamique construit avec Next.js, MongoDB, et Supabase.

## 🚀 Stack Technique

### Frontend
- **Next.js 14** - App Router avec React Server Components
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling (via CDN dans globals.css)
- **SWR** - Data fetching et caching
- **React Hot Toast** - Notifications
- **Supabase Client** - Accès aux images

### Backend
- **Node.js + Express** - API REST
- **TypeScript** - Typage statique
- **MongoDB + Mongoose** - Base de données
- **Supabase Storage** - Stockage des fichiers
- **JWT** - Authentification
- **Bcrypt** - Hachage des mots de passe
- **Multer** - Upload de fichiers

## 📁 Structure du Projet

```
Thiam-Portfolio/
├── backend/                 # API Express + MongoDB
│   ├── src/
│   │   ├── models/         # Schémas Mongoose
│   │   ├── routes/         # Routes API
│   │   ├── middleware/     # Auth middleware
│   │   ├── lib/            # Utilitaires (DB, Supabase)
│   │   └── index.ts        # Point d'entrée
│   ├── package.json
│   ├── .env.example
│   └── tsconfig.json
│
└── frontend/                # Application Next.js
    ├── src/
    │   ├── app/            # Pages et layouts (App Router)
    │   ├── components/     # Composants React
    │   ├── lib/            # API client, Supabase
    │   └── types/          # Types TypeScript
    ├── package.json
    ├── .env.example
    └── tsconfig.json
```

## 🔧 Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd Thiam-Portfolio
```

### 2. Installer les dépendances

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configuration Backend

Créez un fichier `.env` dans `backend/` :

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/thiam-portfolio
# ou MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/thiam-portfolio

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_characters

# Admin (pour création initiale)
ADMIN_EMAIL=admin@cheickthiam.com
ADMIN_PASSWORD=VotreMotDePasseSecurise123!

# CORS
FRONTEND_URL=http://localhost:3000
```

### 4. Configuration Frontend

Créez un fichier `.env.local` dans `frontend/` :

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:5000

# Supabase (clés publiques)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key
```

### 5. Configuration Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Allez dans **Storage** et créez deux buckets :
   - `images` (Public) - Pour les images de projets et profil
   - `certifications` (Private) - Pour les fichiers de certifications

### 6. Créer le compte Admin

Utilisez l'endpoint pour créer votre compte admin :

```bash
curl -X POST http://localhost:5000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cheickthiam.com",
    "password": "VotreMotDePasseSecurise123!",
    "name": "Cheick Ahmed Thiam"
  }'
```

## 🚀 Démarrage

### Mode Développement

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

L'application sera accessible sur :
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000
- **Admin Dashboard** : http://localhost:3000/admin

## 📝 API Endpoints

### Public
- `GET /api/profile` - Récupérer le profil
- `GET /api/experiences` - Liste des expériences visibles
- `GET /api/projects` - Liste des projets
- `GET /api/certifications` - Liste des certifications
- `GET /api/certifications/:id/download` - URL de téléchargement
- `POST /api/contact` - Envoyer un message

### Admin (Auth Required)
- `POST /api/auth/login` - Connexion admin
- `POST /api/auth/create-admin` - Créer un admin (à désactiver après)
- `POST|PUT|DELETE /api/experiences` - CRUD expériences
- `POST|PUT|DELETE /api/projects` - CRUD projets (avec upload)
- `POST|PUT|DELETE /api/certifications` - CRUD certifications (avec fichiers)
- `GET /api/contact` - Liste des messages
- `PUT /api/profile` - Modifier le profil
- `POST /api/profile/image` - Upload image de profil

## 🎨 Fonctionnalités

### Public
- ✅ Hero avec animation de typing
- ✅ Section À propos avec compétences
- ✅ Timeline interactive des expériences
- ✅ Galerie de projets avec modal
- ✅ Certifications téléchargeables
- ✅ Formulaire de contact fonctionnel
- ✅ Mode sombre / clair
- ✅ Design responsive
- ✅ Animations scroll reveal

### Admin Dashboard
- ✅ Authentification sécurisée (JWT)
- ⚠️ CRUD Expériences (À compléter)
- ⚠️ CRUD Projets avec upload d'images (À compléter)
- ⚠️ CRUD Certifications avec upload de fichiers (À compléter)
- ⚠️ Gestion des messages de contact (À compléter)
- ⚠️ Edition du profil et image (À compléter)

## 🔒 Sécurité

- Mots de passe hachés avec bcrypt
- Authentification par JWT
- Routes admin protégées
- Fichiers sensibles dans .gitignore
- CORS configuré
- Variables d'environnement séparées

## 📦 Build Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

## 🤝 Contribution

Ce projet est un portfolio personnel. Pour toute suggestion :
1. Fork le projet
2. Créez une branche (`git checkout -b feature/amelioration`)
3. Committez (`git commit -m 'Ajout fonctionnalité'`)
4. Push (`git push origin feature/amelioration`)
5. Ouvrez une Pull Request

## 📄 Licence

MIT © 2025 Cheick Ahmed Thiam

## 📧 Contact

- Email: contact@cheickthiam.com
- LinkedIn: [Votre profil LinkedIn]
- GitHub: [Votre profil GitHub]

---

**Note** : Les pages CRUD complètes du dashboard admin sont à développer selon vos besoins spécifiques.
