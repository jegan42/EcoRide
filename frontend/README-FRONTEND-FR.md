### GO TO : **[🇬🇧 English version](./README-FRONTEND-EN.md)**

#### **[Présentation du projet](../README-FR.md)**

#### **[README principal](../README-MAIN-FR.md)**

#### **[Backend – Express / Prisma](../backend/README-BACKEND-FR.md)**

---

# 🚗 EcoRide — Frontend

EcoRide est une plateforme de covoiturage moderne, pensée pour connecter conducteurs et passagers avec un focus sur la confiance, la flexibilité, et l’ergonomie.

Ce frontend est développé avec **React 19**, **TypeScript**, **Vite**, et **Material UI**.

---

## 🚀 Présentation de la stack

| Outil                                            | Version  | Description                                             |
| ------------------------------------------------ | -------- | ------------------------------------------------------- |
| [React](https://react.dev)                       | ^19.1.0  | Librairie principale frontend                           |
| [Vite](https://vitejs.dev)                       | ^6.3.5   | Outil de build ultra-rapide                             |
| [TypeScript](https://www.typescriptlang.org)     | \~5.8.3  | Typage statique                                         |
| [Material UI (MUI)](https://mui.com)             | ^7.1.2   | Bibliothèque de composants avec design system complet   |
| [Redux Toolkit](https://redux-toolkit.js.org)    | ^2.8.2   | Gestion d’état scalable et efficace                     |
| [React Hook Form](https://react-hook-form.com)   | ^7.56.4  | Gestion performante et flexible des formulaires         |
| [Firebase](https://firebase.google.com)          | ^11.8.1  | Fonctionnalités temps réel (historique, avis, contacts) |
| [React Router](https://reactrouter.com)          | ^7.6.1   | Routage, routes protégées et admin                      |
| [Zod](https://github.com/colinhacks/zod)         | ^3.25.33 | Validation typée des schémas                            |
| [Notistack](https://iamhosseindhv.com/notistack) | ^3.0.2   | Système de notifications toast                          |
| [Recharts](https://recharts.org/)                | ^3.0.0   | Librairie de graphiques pour l’administration           |

---

## 📦 Structure du projet

```
src/
│
├── api/                    # Instance Axios
├── components/             # Composants UI réutilisables
├── hooks/                  # Hooks React personnalisés
├── layouts/                # Gabarits de pages
├── pages/                  # Pages applicatives (publiques + protégées)
├── router/                 # Logique de routage (ProtectedRoute, AdminRoute)
├── services/               # Requêtes données (REST + Firebase)
├── store/                  # Store Redux & slices
├── types/                  # Modèles et énumérations TypeScript
└── utils/                  # Fonctions utilitaires (formatage, guards, etc.)
```

---

## 🔐 Authentification & Sécurité

* Authentification via **JWT** (stocké de manière sécurisée dans des cookies HttpOnly avec politique SameSite).
* Authentification **Firebase** utilisée temporairement pour accès aux données noSQL.
* Stratégie Google OAuth intégrée via `passport.js` côté backend.
* Protection CSRF via middleware personnalisé.
* Routes sécurisées avec les wrappers `ProtectedRoute` et `AdminRoute`.

---

## 🧠 Fonctionnalités clés

### 🌍 Pages publiques

* **Accueil**, **À propos**, **Mentions légales**, **Contact** (formulaire intégré avec Firebase)

### 👤 Authentification

* Connexion via JWT + option Google OAuth
* Dashboard utilisateur et routes admin protégées

### 👤 Dashboard utilisateur

* Mise à jour du **profil** et des **préférences utilisateur**
* Gestion des **véhicules**
* Gestion des **trajets** (création, modification, annulation)
* Gestion des **réservations** (confirmation, annulation)
* Laisser des **avis**, signaler les **no-shows**
* Consultation de l’**historique des trajets**

### 🚘 Recherche de trajets

* Filtres avancés : type d’énergie, note, places, prix, date
* Détail complet du trajet avec infos conducteur, véhicule, préférences

### ⭐️ Avis

* Système d’avis pour **conducteurs** et **passagers**
* Moyennes calculées séparément selon le rôle (`asDriver` / `asPassenger`)
* Pas de note attribuée pour les `no_show`

### 🕒 Historique

* Suivi des actions (`terminé`, `annulé`, `no_show`)
* Enrichi avec les données voyage et utilisateur

### 🔧 Dashboard Admin

* Accès sécurisé réservé aux admins
* Gestion des **utilisateurs**, **trajets**, **contacts**
* Statistiques graphiques : inscriptions hebdomadaires, stats trajets, types d’utilisateurs, etc.

---

## 🖌️ UI & UX

* Basé sur **Material UI v7** avec `@emotion`
* Thèmes et mises en page personnalisés
* Design responsive complet (mobile-first)
* Sections du dashboard repliables pour plus de clarté
* Notifications toast fluides avec **notistack**

---

## 🧪 Tests & Linting

* Tests unitaires avec **Vitest** + **React Testing Library**
* Formatage automatique via **Prettier**
* ESLint configuré avec Airbnb, React, et Prettier

---

## 📊 Notes de déploiement

* Frontend prévu pour déploiement sur **Render**
* Backend + DB (PostgreSQL via **Neon**) aussi ciblés sur Render
* Firebase utilisé pour :

  * Avis
  * Soumissions du formulaire de contact
  * Historique des trajets

---

## ⚠️ Remarques

* Projet **solo**, à but pédagogique et démonstratif.
* Utilisation Firebase + API backend.
* Fonctionnalités admin en cours de développement.

---

## 📌 TODO (Roadmap)

* [ ] Ajouter fonctionnalités réinitialisation mot de passe et suppression compte
* [ ] Support du mode sombre
* [ ] Ajout d’une solution d’internationalisation (FR/EN)

---

## 🧾 Licence

Ce projet est sous licence [MIT](LICENSE).

---

## 🧑‍💻 Auteur

> Développé avec ❤️ par Jyzee pour EcoRide 🚗
