# API Endpoints - Thiam Portfolio Backend

**Base URL**: `http://localhost:5000/api` (dev) ou `https://your-backend-url.com/api` (prod)

## 🔐 Authentication

### `/api/auth`

| Méthode | Endpoint | Protection | Description |
|---------|----------|------------|-------------|
| `POST` | `/login` | Public | Connexion admin |
| `POST` | `/create-admin` | Public | Créer un compte admin (à désactiver en production) |

**POST /api/auth/login**
```json
// Request
{
  "email": "admin@example.com",
  "password": "yourpassword"
}

// Response
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "admin": {
    "id": "admin_id",
    "email": "admin@example.com",
    "name": "Admin Name"
  }
}
```

---

## 👤 Profile

### `/api/profile`

| Méthode | Endpoint | Protection | Description |
|---------|----------|------------|-------------|
| `GET` | `/` | Public | Obtenir le profil |
| `PUT` | `/` | Admin | Mettre à jour le profil |
| `POST` | `/image` | Admin | Upload image de profil |

**GET /api/profile**
```json
// Response
{
  "_id": "profile_id",
  "name": "Cheick Ahmed Thiam",
  "title": "Consultant en Stratégie & Développement",
  "bio": "Expert en pilotage de projets...",
  "email": "contact@cheickthiam.com",
  "phone": "+221 XX XXX XX XX",
  "location": "Dakar, Sénégal",
  "profileImageUrl": "https://...",
  "typingTexts": ["Text 1", "Text 2"],
  "socialLinks": {
    "linkedin": "https://...",
    "github": "https://...",
    "twitter": "https://..."
  }
}
```

---

## 💼 Experiences

### `/api/experiences`

| Méthode | Endpoint | Protection | Description |
|---------|----------|------------|-------------|
| `GET` | `/` | Public | Liste des expériences visibles |
| `GET` | `/all` | Admin | Toutes les expériences |
| `GET` | `/:id` | Public | Obtenir une expérience |
| `POST` | `/` | Admin | Créer une expérience |
| `PUT` | `/:id` | Admin | Mettre à jour une expérience |
| `DELETE` | `/:id` | Admin | Supprimer une expérience |

**GET /api/experiences**
```json
// Response
[
  {
    "_id": "exp_id",
    "title": "Consultant en Stratégie",
    "company": "CAT Consulting",
    "year": "2023 - Présent",
    "description": "Description...",
    "responsibilities": ["Resp 1", "Resp 2"],
    "tags": ["Strategy", "Management"],
    "order": 1,
    "isVisible": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

---

## 🚀 Projects

### `/api/projects`

| Méthode | Endpoint | Protection | Description |
|---------|----------|------------|-------------|
| `GET` | `/` | Public | Liste de tous les projets |
| `GET` | `/:id` | Public | Obtenir un projet |
| `POST` | `/` | Admin | Créer un projet (avec upload d'image) |
| `PUT` | `/:id` | Admin | Mettre à jour un projet |
| `DELETE` | `/:id` | Admin | Supprimer un projet |

**POST /api/projects** (multipart/form-data)
```
title: "Project Title"
description: "Short description"
fullDescription: "Full description"
tags: ["React", "Node.js"]
link: "https://project-url.com"
githubLink: "https://github.com/user/repo"
image: [file]
```

**GET /api/projects**
```json
// Response
[
  {
    "_id": "project_id",
    "title": "Portfolio Website",
    "description": "A modern portfolio...",
    "fullDescription": "Detailed description...",
    "tags": ["Next.js", "TypeScript", "MongoDB"],
    "cover_url": "https://...",
    "imageUrl": "https://...",
    "project_url": "https://...",
    "link": "https://...",
    "githubLink": "https://github.com/...",
    "order": 1,
    "isVisible": true,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

---

## 🎓 Certifications

### `/api/certifications`

| Méthode | Endpoint | Protection | Description |
|---------|----------|------------|-------------|
| `GET` | `/` | Public | Liste des certifications |
| `GET` | `/:id` | Public | Obtenir une certification |
| `GET` | `/:id/download` | Public | Télécharger le fichier |
| `POST` | `/` | Admin | Créer une certification (avec upload) |
| `PUT` | `/:id` | Admin | Mettre à jour une certification |
| `DELETE` | `/:id` | Admin | Supprimer une certification |

**GET /api/certifications/:id/download**
```json
// Response
{
  "downloadUrl": "https://signed-url-valid-1h..."
}
```

**POST /api/certifications** (multipart/form-data)
```
title: "AWS Certified Solutions Architect"
issuer: "Amazon Web Services"
date: "2023-06-15"
description: "Professional certification..."
tags: ["AWS", "Cloud"]
file: [PDF file]
```

---

## 📧 Contact

### `/api/contact`

| Méthode | Endpoint | Protection | Description |
|---------|----------|------------|-------------|
| `POST` | `/` | Public | Envoyer un message |
| `GET` | `/` | Admin | Liste des messages |
| `PATCH` | `/:id/read` | Admin | Marquer comme lu |
| `DELETE` | `/:id` | Admin | Supprimer un message |

**POST /api/contact**
```json
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Collaboration",
  "message": "Hello, I would like to..."
}

// Response
{
  "message": "Message envoyé avec succès",
  "contact": {
    "_id": "contact_id",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Collaboration",
    "message": "Hello, I would like to...",
    "isRead": false,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

---

## 🔒 Authentication Header

Pour les routes protégées (Admin), inclure le token JWT dans les headers :

```
Authorization: Bearer your_jwt_token_here
```

---

## ⚠️ Codes d'Erreur Communs

| Code | Description |
|------|-------------|
| `200` | Succès |
| `201` | Créé avec succès |
| `400` | Requête invalide |
| `401` | Non authentifié |
| `403` | Non autorisé |
| `404` | Ressource non trouvée |
| `500` | Erreur serveur |

---

## 📝 Notes

- Les routes marquées **Admin** nécessitent une authentification JWT
- Les uploads de fichiers utilisent `multipart/form-data`
- Les images sont stockées sur Supabase Storage
- Les certifications génèrent des URLs signées valides 1 heure
- Le contact envoie automatiquement un email de notification à l'admin
