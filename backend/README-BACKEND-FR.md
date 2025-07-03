### GO TO : **[🇬🇧 English version](./README-BACKEND-EN.md)**

#### **[Présentation du projet](../README-FR.md)**

#### **[README principal](../README-MAIN-FR.md)**

#### **[Frontend – React](../frontend/README-FRONTEND-FR.md)**

---

# 🚀 EcoRide — Backend

Backend REST API construite avec **Node.js** et **TypeScript** pour _EcoRide_, une plateforme de covoiturage moderne, sécurisée, et respectueuse de la vie privée.

---

## 📚 Table des matières

1. [Stack technique](#1-stack-technique)
2. [Authentification & Sécurité](#2-authentification--sécurité)
3. [Base de données & ORM](#3-base-de-données--orm)
4. [Points d’API](#4-points-dapi)
5. [Structure du projet](#5-structure-du-projet)
6. [Exécution locale](#6-exécution-locale)
7. [Tests & Qualité](#7-tests--qualité)
8. [Rôles utilisateurs](#8-rôles-utilisateurs)
9. [Variables d’environnement](#9-variables-denvironnement)
10. [Plan de déploiement](#10-plan-de-déploiement)
11. [Améliorations futures](#11-améliorations-futures)
12. [Auteur](#auteur)

---

## 1. Stack technique

| Technologie            | Version | Usage                                           |
| ---------------------- | ------- | ----------------------------------------------- |
| **Node.js**            | 22.x    | Runtime backend asynchrone performant           |
| **TypeScript**         | \~5.2   | Typage fort, meilleure maintenabilité           |
| **Express**            | 5.1.0   | Framework HTTP léger                            |
| **Prisma ORM**         | 6.7.0   | Accès DB type-safe                              |
| **Neon (PostgreSQL)**  | externe | PostgreSQL serverless scalable                  |
| **Passport.js**        | 0.7.0   | Auth Google OAuth 2.0                           |
| **Firebase Admin SDK** | 13.4.0  | Génération token frontend uniquement            |
| **Helmet**             | 8.1.0   | Sécurité headers (CSP, XSS)                     |
| **express-session**    | 1.18.1  | Gestion sessions cookie                         |
| **Rate Limiter**       | 7.5.0   | Protection anti-abus                            |
| **Resend**             | API     | Emails transactionnels (contact, notifications) |

---

## 2. Authentification & Sécurité

- 🔐 Sessions sécurisées via cookies (SameSite + HTTPOnly)
- 🔐 Auth Google OAuth 2.0 avec Passport
- 🧾 JWT interne pour logique utilisateur + accès Firebase frontend
- 🛡️ Protection CSRF avec `csurf`
- 📦 Limitation de taux par route et rôle
- ⚙️ Headers sécurité avancés via Helmet
- 🧯 Logging détaillé avec Morgan
- 📧 Emails envoyés via Resend API

---

## 3. Base de données & ORM

- **Base :** PostgreSQL hébergée sur [Neon.tech](https://neon.tech)
- **ORM :** Prisma avec typage complet

### Entités & relations

- `User`, `Trip`, `Booking`, `Vehicle`, `UserPreferences`

### 🔑 Usage Firebase :

> Firebase est **uniquement utilisé** en backend pour générer des tokens personnalisés destinés au frontend.
> Aucune base Firebase utilisée dans la logique backend.

---

## 4. Points d’API

<details>  
<summary><strong>👤 Auth</strong></summary>

```http
POST   /api/auth/signup
POST   /api/auth/signin
POST   /api/auth/signout
PUT    /api/auth/update
GET    /api/auth/me
GET    /api/auth/all         # admin seulement
```

</details>

<details>  
<summary><strong>🚘 Véhicules</strong></summary>

```http
POST   /api/vehicles/
GET    /api/vehicles/
GET    /api/vehicles/:id
PUT    /api/vehicles/:id
DELETE /api/vehicles/:id
```

</details>

<details>  
<summary><strong>🛣️ Trajets</strong></summary>

```http
POST   /api/trips/
GET    /api/trips/all
GET    /api/trips/driver
POST   /api/trips/search
GET    /api/trips/:id
PUT    /api/trips/:id
DELETE /api/trips/:id
```

</details>

<details>  
<summary><strong>📆 Réservations</strong></summary>

```http
POST   /api/bookings/
DELETE /api/bookings/:id
GET    /api/bookings/me
GET    /api/bookings/driver
POST   /api/bookings/:id/validate
```

</details>

<details>  
<summary><strong>⚙️ Préférences</strong></summary>

```http
POST   /api/preferences/
GET    /api/preferences/me
GET    /api/preferences/:id
PUT    /api/preferences/
DELETE /api/preferences/
```

</details>

<details>  
<summary><strong>🔑 Token Firebase</strong></summary>

```http
GET    /api/firebase-token
```

</details>

---

## 5. Structure du projet

```
src/
├── controllers/      # Logique des routes
├── services/         # Logique métier
├── routes/           # Routeurs Express
├── validators/       # Schémas de validation
├── middleware/       # Auth, CSRF, gestion erreurs
├── firebase/         # Génération token personnalisé
├── passport/         # Stratégie Google OAuth
├── types/            # Types TS personnalisés
├── tests/            # Tests Jest + Supertest
```

---

## 6. Exécution locale

### 🛠 Prérequis

- Node.js 20+ (idéalement 22)
- Accès PostgreSQL Neon ou local
- Fichier JSON compte service Firebase

### ▶️ Étapes

```bash
# 1. Cloner le repo
git clone https://github.com/your-org/ecoride.git

# 2. Installer dépendances
cd ecoride/backend
npm install

# 3. Configurer .env
cp .env.example .env
# Remplir les variables

# 4. Appliquer les migrations Prisma (optionnel)
npx prisma db push

# 5. Lancer le serveur
npm run dev
```

---

## 7. Tests & Qualité

- ✅ Tests unitaires & intégration : `Jest` + `Supertest`
- ✅ Linting : `eslint`, `prettier`

### Scripts utiles

```bash
npm run dev         # Serveur dev
npm run test        # Tests
npm run test:cov    # Couverture tests
npm run lint:fix    # Correction auto des erreurs lint
```

---

## 8. Rôles utilisateurs

| Rôle        | Description                               |
| ----------- | ----------------------------------------- |
| `passenger` | Réserve des trajets, modifie profil/préfs |
| `driver`    | Crée trajets, valide réservations         |
| `admin`     | Gestion complète utilisateurs/trajets     |
| `suspended` | Visiteur avec accès limité                |
| `employee`  | Futur rôle modération                     |

---

## 9. Variables d’environnement

> Voir `.env.example` pour liste complète.

```env
PORT=5000
NODE_ENV=development

DATABASE_URL=postgresql://...

JWT_SECRET=...
SESSION_SECRET=...
COOKIE_SAMESITE=strict

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:3000

FIREBASE_ADMIN_KEY_JSON={...}

RESEND_API_KEY=...
RESEND_FROM_EMAIL=noreply@ecoride.io
RESEND_BCC_EMAIL=bcc@ecoride.io
RESEND_CONTACT_EMAIL=contact@ecoride.io
```

---

## 10. Plan de déploiement

> 🌱 Déploiement initial local. Production prévue via :

- 🐳 [Render](https://render.com) fullstack
- 🐘 [Neon](https://neon.tech) PostgreSQL serverless
- 🔐 Variables secrètes via `.env` ou gestionnaire de secrets

---

## 11. Améliorations futures

- [ ] Intégration Stripe paiement

---

## Auteur

Réalisé par **Jyzee**
Code propre, architecture modulaire, focus sécurité et testabilité.

> Tous les commits respectent les conventions `feat`, `fix`, `refactor`, etc.
