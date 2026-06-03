# RecettesMonde

Application web fullstack de partage de recettes internationales. Développée dans le cadre du projet Yboost — Bachelor 2 Ynov.

---

## Stack technique

### Frontend
| Technologie | Version | Rôle |
|---|---|---|
| React | 19 | Framework UI |
| React Router DOM | 7 | Routing SPA |
| Tailwind CSS | 4 | Styles |
| Vite | 8 | Bundler / dev server |
| vite-plugin-pwa | 1 | PWA (installable) |

### Backend
| Technologie | Version | Rôle |
|---|---|---|
| Fastify | 5 | Serveur HTTP |
| @fastify/jwt | 9 | Authentification JWT |
| @fastify/cors | 10 | CORS |
| bcryptjs | 3 | Hashage des mots de passe |
| tsx | 4 | Exécution TypeScript/ESM |

### Base de données
| Technologie | Version | Rôle |
|---|---|---|
| PostgreSQL | — | Base de données relationnelle |
| Prisma | 7 | ORM |
| @prisma/adapter-pg | 7 | Adaptateur PostgreSQL |

---

## Architecture

```
yboost_3/
├── server/
│   ├── index.js          # Point d'entrée Fastify
│   ├── lib/
│   │   └── prisma.js     # Client Prisma singleton
│   └── routes/
│       ├── auth.js       # POST /api/auth/register|login, GET /api/auth/me
│       ├── recipes.js    # CRUD recettes, notes, commentaires
│       └── users.js      # Profil, favoris, édition compte
├── src/
│   ├── api/
│   │   └── client.js     # Fetch wrapper avec JWT
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── RecipeCard.jsx
│   │   └── RatingStars.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   └── pages/
│       ├── Home.jsx
│       ├── Recipes.jsx
│       ├── RecipeDetail.jsx
│       ├── RecipeForm.jsx
│       ├── Login.jsx
│       ├── Register.jsx
│       └── Profile.jsx
├── prisma/
│   ├── schema.prisma
│   ├── seed.js           # 12 recettes + compte démo
│   ├── clear.js          # Vider la base
│   ├── fix-images.js     # Correction URLs images
│   └── fix-times.js      # Ajout prepTime/servings
└── vite.config.js
```

---

## Modèle de données

```
User ──< Recipe ──< Rating
  |              ──< Comment
  |              ──< Favorite
  ├──< Rating
  ├──< Favorite
  └──< Comment
```

| Modèle | Champs principaux |
|---|---|
| **User** | id, name, email, password (hashé), createdAt |
| **Recipe** | id, title, description, country, type, diet[], ingredients (JSON), steps[], prepTime, servings, imageUrl, authorId |
| **Rating** | id, score (1–5), userId, recipeId — unique par paire |
| **Favorite** | userId + recipeId — clé primaire composite |
| **Comment** | id, content, userId, recipeId, createdAt |

---

## Installation

### Prérequis
- Node.js 18+
- PostgreSQL (local ou distant)

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Créer ou modifier le fichier `.env` à la racine :

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE"
JWT_SECRET="votre-secret-jwt-complexe"
```

### 3. Initialiser la base de données

```bash
# Pousser le schéma vers PostgreSQL
npx prisma db push

# Régénérer le client Prisma
npx prisma generate

# (Optionnel) Peupler avec 12 recettes de démonstration
npm run seed
```

---

## Lancement

Le frontend et le backend doivent tourner dans deux terminaux séparés.

```bash
# Terminal 1 — Backend (port 3001)
npm run server

# Terminal 2 — Frontend (port 5173)
npm run dev
```

L'application est accessible sur **http://localhost:5173**.

Le frontend proxifie automatiquement les requêtes `/api/*` vers `http://localhost:3001` via Vite.

---

## Compte de démonstration

Après `npm run seed` :

| Champ | Valeur |
|---|---|
| Email | `chef@recettes.fr` |
| Mot de passe | `demo1234` |

---

## API — Endpoints

### Authentification

| Méthode | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Créer un compte | Non |
| POST | `/api/auth/login` | Se connecter (retourne JWT) | Non |
| GET | `/api/auth/me` | Profil de l'utilisateur connecté | Oui |

### Recettes

| Méthode | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/recipes` | Lister les recettes (avec filtres) | Non |
| GET | `/api/recipes/:id` | Détail d'une recette | Non |
| POST | `/api/recipes` | Créer une recette | Oui |
| PUT | `/api/recipes/:id` | Modifier une recette | Oui (auteur) |
| DELETE | `/api/recipes/:id` | Supprimer une recette | Oui (auteur) |
| POST | `/api/recipes/:id/ratings` | Noter une recette (1–5) | Oui |
| POST | `/api/recipes/:id/comments` | Commenter une recette | Oui |
| DELETE | `/api/recipes/:id/comments/:cid` | Supprimer un commentaire | Oui (auteur) |

#### Paramètres de recherche — `GET /api/recipes`

| Paramètre | Type | Description |
|---|---|---|
| `search` | string | Recherche dans titre, pays, description, ingrédients |
| `country` | string | Filtrer par pays |
| `type` | string | `entree`, `plat`, `dessert`, `boisson` |
| `diet` | string | Régimes séparés par virgule : `vegetarien,vegan` |
| `page` | number | Numéro de page (défaut : 1) |
| `limit` | number | Résultats par page (max 50, défaut : 12) |

### Utilisateurs

| Méthode | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/users/me` | Profil + stats | Oui |
| PUT | `/api/users/me` | Modifier nom / email / mot de passe | Oui |
| GET | `/api/users/me/recipes` | Mes recettes | Oui |
| GET | `/api/users/me/favorites` | Mes favoris | Oui |
| POST | `/api/users/me/favorites/:id` | Ajouter aux favoris | Oui |
| DELETE | `/api/users/me/favorites/:id` | Retirer des favoris | Oui |

---

## Fonctionnalités

### Recettes
- Création, modification et suppression (CRUD complet)
- Recherche par nom, ingrédient, pays ou description
- Filtres par type de plat (entrée, plat, dessert, boisson) et régime alimentaire
- Pagination (12 recettes par page)
- Temps de préparation et nombre de portions

### Interactions utilisateur
- Notation de 1 à 5 étoiles (une note par utilisateur par recette)
- Commentaires texte avec suppression de ses propres commentaires
- Ajout / retrait des favoris
- Partage de recette (Web Share API avec fallback copie du lien)

### Gestion des utilisateurs
- Inscription et connexion avec JWT (durée 7 jours)
- Mots de passe hashés avec bcrypt (10 rounds)
- Édition du profil (nom, email, mot de passe)
- Page profil avec onglets "Mes recettes" et "Favoris"
- Section favoris sur la page d'accueil

### Interface
- Thème sombre (dark mode)
- Design responsive — mobile, tablette, desktop
- Menu hamburger animé sur mobile
- Panneau filtres en bottom sheet sur mobile
- PWA installable sur mobile et desktop
- Skeletons de chargement animés

---

## Build de production

```bash
npm run build
```

Les fichiers compilés sont générés dans `dist/`. Le service worker PWA est inclus automatiquement.

---

## Scripts utilitaires

```bash
# Peupler la base avec 12 recettes démo (seulement si vide)
npm run seed

# Vider entièrement la base de données
npx tsx prisma/clear.js

# Corriger les URLs d'images cassées
npx tsx prisma/fix-images.js

# Ajouter prepTime/servings aux recettes existantes
npx tsx prisma/fix-times.js
```
