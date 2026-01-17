# Guide Rapide - Création Compte Admin

## Une fois le backend démarré avec succès

Utilisez l'une de ces méthodes pour créer votre compte admin :

### Méthode 1 : Via script Node (Recommandé)
```bash
cd backend
node create-admin.js
```

### Méthode 2 : Via curl (si le script échoue)
```bash
curl -X POST http://localhost:5000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"votreadmin@email.com\",\"password\":\"VotreMotDePasse123!\",\"name\":\"Cheick Ahmed Thiam\"}"
```

### Méthode 3 : Via Postman/Thunder Client
- **URL**: `POST http://localhost:5000/api/auth/create-admin`
- **Headers**: `Content-Type: application/json`
- **Body** (JSON):
```json
{
  "email": "votreadmin@email.com",
  "password": "VotreMotDePasse123!",
  "name": "Cheick Ahmed Thiam"
}
```

## Vérification

Réponse attendue :
```json
{
  "message": "Admin créé avec succès",
  "admin": {
    "_id": "...",
    "email": "votreadmin@email.com",
    "name": "Cheick Ahmed Thiam"
  },
  "token": "eyJhbGci..."
}
```

## Login Admin

1. Ouvrez http://localhost:3000/admin/login
2. Utilisez l'email et mot de passe que vous avez configurés
3. Vous serez redirigé vers le dashboard admin

## En cas d'erreur "Admin already exists"

C'est normal si vous avez déjà créé un admin. Utilisez simplement la page de login.
