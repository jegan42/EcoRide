### GO TO : **[🇬🇧 English version](./README-MAIN-EN.md)**

#### **[Présentation du projet](./README-FR.md)**

#### **[Frontend – React](./frontend/README-FRONTEND-FR.md)**

#### **[Backend – Express / Prisma](./backend/README-BACKEND-FR.md)**

---

# 🚗 EcoRide — Plateforme de covoiturage moderne

_EcoRide est une plateforme sécurisée, réactive et conviviale pour simplifier la recherche, la réservation, et la gestion de trajets en covoiturage entre particuliers._

---

## 🧱 Structure du projet

Le projet est divisé en deux parties principales, chacune avec sa propre base de code et documentation :

-   **Frontend** — SPA moderne en React (TypeScript), utilisant Vite, Redux, Material UI, Firebase (pour historique & avis).
-   **Backend** — API REST sécurisée en Node.js / TypeScript avec Express, Prisma, PostgreSQL (Neon), Passport (Google OAuth), protections CSRF, gestion des rôles, etc.

---

## ⚙️ Stack technique choisie & justifications

| Côté     | Choix                               | Justification principale                                             |
| -------- | ----------------------------------- | -------------------------------------------------------------------- |
| Frontend | **React 19 + Vite**                 | Performance, écosystème riche, typage avec TypeScript                |
|          | **Material UI (MUI)**               | Système de design cohérent et facilement personnalisable             |
|          | **Redux Toolkit**                   | Centralisation de l’état, gestion simple des slices                  |
|          | **React Hook Form + Zod**           | Validation performante avec un schéma typé                           |
|          | **React Router v7**                 | Routage avec logique d'accès sécurisé (admin/protected)              |
| Backend  | **Node.js + Express 5**             | Léger, flexible, middleware-first                                    |
|          | **Prisma ORM + PostgreSQL**         | ORM moderne, typage TypeScript, requêtes optimisées                  |
|          | **Neon (PostgreSQL Cloud)**         | Déploiement cloud simplifié, compatible Prisma                       |
|          | **Passport.js**                     | Auth Google OAuth 2.0 puissante et maintenue                         |
|          | **Firebase**                        | Stockage NoSQL pour avis & historiques                               |
| Sécurité | **CSURF, Helmet, express-session**  | Sécurisation des requêtes, sessions & cookies, limitation de trafic  |
| Emails   | **Resend API**                      | Envoi simple et sécurisé d’emails transactionnels                    |
| Tests    | **Vitest / RTL / Jest / Supertest** | Tests unitaires frontend + backend intégrés à la CI                  |

---

## 🛠️ Démarche d’installation & exécution locale

### 1. Prérequis

-   Node.js `>= 20`
-   npm `>= 9`
-   PostgreSQL (utilisation de Neon en prod, peut être local en dev)
-   Compte Firebase (temporaire)

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Compléter les variables sensibles (voir plus bas)
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Compléter les variables d’environnement (API_URL, Firebase, etc.)
npm run dev
```

---

## 🧪 Configuration de l’environnement

### 🔧 ESLint & Prettier

-   Config partagée entre front & back (`Airbnb`, `Prettier`, `React`, `TypeScript`)
-   Linting exécuté automatiquement avant chaque commit (`husky` possible en CI/CD)

### 🧰 Outils utilisés

| Outil            | Rôle                               |
| ---------------- | ---------------------------------- |
| ESLint           | Analyse statique du code           |
| Prettier         | Formatage automatique              |
| Vitest + RTL     | Tests frontend unitaires           |
| Jest + Supertest | Tests backend (routes, middleware) |
| Vite             | Build rapide et moderne (frontend) |
| ts-node-dev      | Reload rapide du backend en dev    |

### 📁 Structure du dossier

```
/
├── frontend/         # React SPA + Vite + Redux + MUI
│   └── src/          # Composants, pages, hooks, router, store, etc.
├── backend/          # Node.js + Express API
│   ├── src/          # Routes, middlewares, controllers
│   ├── prisma/       # Schéma et seed SQL
├── .env.example      # Variables d’environnement types
├── README.md         # README principal
```

---

## 🧩 Méthodologie de gestion de projet

-   **Méthode** : **Agile** avec inspiration **Kanban**
-   **Suivi** : Trello organisé par _backlog_, _à developper_, _en cours_, _dev terminé_, _Prod_
-   **Découpage en sprints** : 5 à 7 jours par sprint avec priorisation des fonctionnalités majeures
-   **Livrables intermédiaires** :

    -   MVP fonctionnel sans paiement
    -   Ajout progressive des dashboards (admin / employé)

-   **Versioning** : Git conventionnel (`feat`, `fix`, `refactor`, etc.)

---

## 📋 Fonctionnalités principales

-   Recherche avancée de trajets avec filtres (date, énergie, prix, etc.)
-   Réservations, annulations, gestion de passagers
-   Gestion des véhicules, des trajets et préférences utilisateurs
-   Tableau de bord utilisateur : profil, historique, avis, no-show
-   Tableau de bord admin : utilisateurs, trajets, stats et modération
-   Authentification : Google OAuth ou compte classique (JWT)
-   Notifications toast, feedback utilisateur, responsive design

---

## 🛢️ Base de données & services tiers

-   **PostgreSQL (Neon)** — données relationnelles avec Prisma
-   **Firebase Firestore** — utilisé pour :

    -   Avis utilisateurs
    -   Historique de trajets
    -   Formulaire de contact

-   **Resend** — envoi d'emails (admin ou confirmation)

---

## 👤 Auteur

> Projet solo développé par **Jyzee**, avec une approche modulaire, sécurisée, responsive et orientée UX.

---

## 📄 Licence

Ce projet est sous licence MIT — voir [LICENSE](#)
