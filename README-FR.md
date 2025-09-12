### GO TO : **[🇬🇧 English version](./README.md)**

#### **[README principal](./README-MAIN-FR.md)**

#### **[Frontend – React](./frontend/README-FRONTEND-FR.md)**

#### **[Backend – Express / Prisma](./backend/README-BACKEND-FR.md)**

---

## 🚗 Présentation du projet : **EcoRide**

**EcoRide** est une application web de **covoiturage écoresponsable** conçue pour connecter conducteurs et passagers dans une logique de mobilité verte. L’interface met en avant les trajets effectués avec des véhicules électriques et se veut simple, moderne et intuitive.

Elle gère :

-   Les rôles utilisateurs : visiteurs, passagers, chauffeurs, employés, administrateurs
-   L’organisation des trajets (création, réservation)
-   La gestion des crédits et paiements
-   Les avis utilisateurs et leur modération
-   Un tableau de bord d’administration pour piloter la plateforme

---

## 🧠 Réflexion sur les choix techniques

Le choix des technologies a été guidé par plusieurs objectifs :

-   Créer une **application web moderne, rapide et accessible**
-   Faciliter le **déploiement cloud** (hébergement sur Render, base sur Neon)
-   Offrir une **expérience utilisateur fluide** sur desktop comme mobile
-   Garantir une bonne **maintenabilité et scalabilité**

Nous avons donc opté pour une architecture **fullstack JavaScript/TypeScript** découpée en deux parties : un **frontend SPA React** et une **API REST sécurisée Node/Express**. Les données sont centralisées dans une base **PostgreSQL** via l’ORM Prisma.

---

## 🌐 Accès en ligne

-   [🌍 API en ligne (Backend)](https://ecoride-c6c1.onrender.com/)
-   [🖥️ Interface Admin en ligne (Frontend)](https://ecoride-frontend-5cro.onrender.com/admin)

---

## 📘 Documentation rapide

📄 Ce dépôt contient toute la documentation du projet EcoRide.

-   [README principal](./README-MAIN-FR.md)
-   [Frontend – React](./frontend/README-FRONTEND-FR.md)
-   [Backend – Express / Prisma](./backend/README-BACKEND-FR.md)

---

## ⚙️ Stack technique

| Partie                   | Techno principale              | Pourquoi ce choix ?                               |
| ------------------------ | ------------------------------ | ------------------------------------------------- |
| **Frontend**             | React, TypeScript, MUI         | Composants modulaires, performance, accessibilité |
| **Backend**              | Node.js, Express, Prisma       | Simplicité, rapidité, typage strict avec TS       |
| **Base de données**      | Neon (PostgreSQL)              | Scalable, serverless, cloud natif                 |
| **Firebase (Firestore)** | Stockage NoSQL (avis/messages) | Simple, temps réel, très intégré à Firebase       |
| **Déploiement**          | Render                         | Facilité, gratuité, CI/CD intégrable              |

---

### 🖥️ Frontend

| Technologie          | Rôle                         | Pourquoi ce choix ?                         |
| -------------------- | ---------------------------- | ------------------------------------------- |
| **Vite**             | Dev server & bundler         | Rapide, moderne, remplace CRA               |
| **React**            | UI SPA                       | Composants réactifs, populaires             |
| **TypeScript**       | Typage statique              | Moins d’erreurs, meilleures suggestions     |
| **@mui/material**    | UI Components                | Design system robuste et accessible         |
| **React Hook Form**  | Formulaires                  | Performant, ergonomique                     |
| **Redux Toolkit**    | State management             | Centralisé et simplifié                     |
| **Axios**            | Requêtes HTTP                | Support des interceptors, simple à utiliser |
| **React Router DOM** | Routing SPA                  | Navigation fluide entre les pages           |
| **Zod**              | Validation côté client       | Simple, typé, avec RHF                      |
| **Vitest + RTL**     | Tests unitaires + composants | Rapide et orienté utilisateur               |

---

### 🛠️ Backend (Render)

| Technologie                    | Rôle                            | Pourquoi ce choix ?                                |
| ------------------------------ | ------------------------------- | -------------------------------------------------- |
| **Node.js**                    | Runtime JavaScript              | Asynchrone, performant                             |
| **Express**                    | Framework web léger             | Minimaliste, extensible                            |
| **TypeScript**                 | Typage statique                 | Meilleure maintenance et sécurité                  |
| **Prisma ORM**                 | ORM                             | Typé, migrations simples, très intégré à TS        |
| **Neon (PostgreSQL)**          | Base de données Cloud           | PostgreSQL scalable, Serverless, compatible Render |
| **Passport.js + Google OAuth** | Authentification                | Standardisé, sécurisé, centralisé                  |
| **jsonwebtoken (JWT)**         | Auth via token                  | Rapide, sécurisé, portable                         |
| **express-session**            | Sessions persistantes           | Nécessaire pour Passport ou login prolongé         |
| **cookie-parser**              | Lecture/écriture cookies        | Nécessaire pour auth/session                       |
| **bcrypt**                     | Hachage des mots de passe       | Sûr, éprouvé                                       |
| **helmet**                     | Headers HTTP sécurisés          | Protection contre XSS, etc.                        |
| **csurf**                      | Protection CSRF                 | Important si stateful                              |
| **express-rate-limit**         | Limite brute-force              | Protège les endpoints sensibles                    |
| **express-validator**          | Validation des inputs serveur   | Sécurité et robustesse API                         |
| **dotenv**                     | Gestion des variables env       | Séparation env/dev/prod                            |
| **firebase-admin**             | Token pour accès en frontend    | Récupération token pour usage en frontend          |
| **resend**                     | Envoi d'e-mails transactionnels | Simplicité, alternative à Nodemailer               |

---

### 🧪 Tests

| Outil                     | Rôle                             | Pourquoi ce choix ?        |
| ------------------------- | -------------------------------- | -------------------------- |
| **Vitest** (frontend)     | Tests unitaires & composants     | Rapide, intégré à Vite     |
| **React Testing Library** | Tests React orientés utilisateur | UX-driven                  |
| **Supertest** (backend)   | Tests routes API                 | Compatible Express         |
| **Jest** (backend)        | Runner principal                 | Puissant, complet          |
| **ts-jest**               | TS + Jest                        | Pour compiler les tests TS |

---

### 🗃️ Base de données

| Technologie            | Rôle                       | Pourquoi ce choix ?                         |
| ---------------------- | -------------------------- | ------------------------------------------- |
| **Neon**               | PostgreSQL Cloud           | Serverless, gratuit, compatible avec Render |
| **Firebase Firestore** | Données non-relationnelles | Messages, avis, notifications en temps réel |
| **Prisma**             | ORM                        | Génère types + accès DB + migrations        |

---

### 🔐 Sécurité & Emailing

| Outil                 | Rôle                            | Pourquoi ce choix ?              |
| --------------------- | ------------------------------- | -------------------------------- |
| **Multer** (à venir ) | Upload de fichiers              | Support du `multipart/form-data` |
| **Resend**            | Envoi d’e-mails transactionnels | API simple, fiable (SMTP/API)    |
| **bcrypt**            | Hachage                         | Sécurité des mots de passe       |

---

### ☁️ Déploiement

| Plateforme                     | Usage                          | Pourquoi ce choix ?                                |
| ------------------------------ | ------------------------------ | -------------------------------------------------- |
| **Render**                     | Hébergement frontend + backend | Gratuit, simple à utiliser, CI/CD                  |
| **Neon**                       | Base de données PostgreSQL     | Scalable, usage gratuit généreux, bons perfs       |
| **GitHub Actions** (optionnel) | CI/CD                          | Tests, build, lint auto                            |
| **deSEC.io**                   | DNS / sous-domaines gratuits   | Fournit des domaines dynamiques (type `.dedyn.io`) |
| **Improvmx**                   | Redirection e-mail (MX)        | Redirige vers une boîte réelle gratuitement        |

---

## 📁 Architecture du projet

```
/ecoride
│
├── README-MAIN-FR.md         → Documentation générale du projet
├── /backend                  → Backend Express + Prisma
│   ├── README-BACKEND-FR.md  → Infos spécifiques à l’API backend
│   ├── /controllers          → Logique métier
│   ├── /routes               → Définition des endpoints
│   ├── /middlewares          → Auth, erreurs, CSRF, etc.
│   ├── /prisma               → Schéma de DB et seed
│   └── app.ts                → Point d’entrée backend
│
├── /frontend                 → Frontend React (Vite)
│   ├── README-FRONTEND-FR.md → Infos spécifiques au frontend React
│   ├── /components           → Composants réutilisables
│   ├── /pages                → Pages de l'application
│   ├── /store                → State (Redux Toolkit)
│   └── main.tsx              → Point d’entrée frontend
│
└── .env                      → Variables d’environnement

```

---

## 🔧 Installation locale

### Prérequis

-   Node.js v20+
-   npm v9+
-   PostgreSQL ou compte Neon (base cloud)
-   Git

### Clonage du projet

```bash
git clone https://github.com/jegan42/EcoRide.git
cd ecoride
```

### Installation des dépendances

```bash
cd backend && npm install      # Backend
cd ../frontend && npm install    # Frontend
```

### Configuration de l’environnement (`.env`)

#### Dans `/backend/.env` :

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ecoride
JWT_SECRET=une_clé_ultra_secrète
SESSION_SECRET=un_autre_secret
FRONTEND_URL=http://localhost:5173
```

#### Dans `/frontend/.env` :

```env
VITE_API_URL=http://localhost:3000
```

### Initialisation de la base de données

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

---

## 🚀 Lancer l'application en local

### Lancer l'API

```bash
cd backend
npm run dev
# Accessible sur http://localhost:3000
```

### Lancer le frontend

```bash
cd frontend
npm run dev
# Accessible sur http://localhost:5173
```

---

## 🔐 Compte administrateur par défaut

Lors de la création de la base (`prisma/seed.ts`), un compte admin est injecté :

-   **Email** : `adminfortest@ecoride.dedyn.io`
-   **Mot de passe** : `Mon@email.123`

> 🔒 Le mot de passe est hashé avec **bcrypt**, et ne peut être récupéré. Modifiez-le après la première connexion.

---

## 📊 Cas d'utilisation principaux

### Utilisateurs

-   S'inscrire comme passager
-   L'ajout d'un véhicule, ajoute chauffeur en rôle
-   Modifier son profil
-   Consulter ses trajets passés / à venir

### Chauffeurs

-   Proposer un trajet
-   Modifier / annuler un trajet
-   Gérer les demandes

### Passagers

-   Rechercher un trajet
-   Réserver une place
-   Noter le trajet

### Employés / Admin

-   Gérer les comptes utilisateurs
-   Modérer les avis
-   Répondre aux messages
-   Suivre les statistiques

---

## 🧭 Diagrammes

### ✅ Cas d'utilisation

-   [Scénario 1 – Connexion](./doc/DATABASE_7A_Diagramme_de_séquence.png)
-   [Scénario 2 – Publication d’un trajet par un chauffeur](./doc/DATABASE_7B_Diagramme_de_séquence.png)
-   [Scénario 3 – Réservation d’un trajet](./doc/DATABASE_7C_Diagramme_de_séquence.png)

### 🗃️ Modélisation des données

-   [DATABASE](./doc/database.sql)
-   [Définition des tables (entités)](./doc/DATABASE_1_Définition_des_tables%28entités%29.pdf)
-   [Champs + types + contraintes (tableaux détaillés)](./doc/DATABASE_2_Champs_types_contraintes%28tableaux_détaillés%29.pdf)
-   [MCD (Modèle Conceptuel de Données) – version textuelle](./doc/DATABASE_3_MCD%28Modèle_Conceptuel_de_Données%29version–textuelle.pdf)
-   [MCD (Modèle Conceptuel de Données) – version visuel](./doc/DATABASE_4_MCD%28Modèle_Conceptuel_de_Données%29version_visuel.png)
-   [Diagramme UML de classes](./doc/DATABASE_5_Diagramme_UML_de_classes.png)
-   [Diagramme d’utilisation](./doc/DATABASE_6_Diagramme_d_utilisation.png)

---

## 🎨 Charte graphique (fichier `charte_graphique.pdf`)

-   [Charte Graphique](./doc/Page_Charte_Graphique.pdf)
-   [Annotation UX](./doc/Page_Annotation_UX.pdf)
-   [FIGMA](https://www.figma.com/design/7lTQWwT0os4P9HB8NNlPjJ/Projet-EcoRide---ECF-DWWM?node-id=3-2&t=SYm7u2FFSCxxXrk1-0)

### Polices

-   **Poppins** – [Google Fonts](https://fonts.google.com/specimen/Poppins) – Licence libre

### Couleurs principales

| Couleur   | Usage                    |
| --------- | ------------------------ |
| `#A5D6A7` | Vert écolo (primaire)    |
| `#2E7D32` | Vert forêt (boutons)     |
| `#F5F5F5` | Fond clair, zen          |
| `#263238` | Texte principal          |
| `#FFFFFF` | Fond secondaire / cartes |

### Logo

-   [Le Logo de EcoRide](./doc/ecoride_logo.png)
    Logo représentant une **feuille stylisée** dans une **voiture** – minimaliste et évocateur.

---

## 📱 Maquettes wireframe

Contenu :

-   Page d’accueil (recherche trajet)

-   Formulaire de réservation

-   [FIGMA](https://www.figma.com/design/7lTQWwT0os4P9HB8NNlPjJ/Projet-EcoRide---ECF-DWWM?node-id=3-2&t=SYm7u2FFSCxxXrk1-0)

---

## 📌 Suivi de projet & outils collaboratifs

-   [TRELLO](https://trello.com/b/RdURamDs/projet-ecoride-ecf-dwwm)
