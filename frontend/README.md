# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
---

````markdown
# EcoRide – Web Frontend

**EcoRide** est une startup française dédiée à la réduction de l’impact environnemental des déplacements, en encourageant le covoiturage automobile. Ce projet a été initié par José, le CTO, avec pour ambition de devenir la plateforme de covoiturage préférée des voyageurs écoresponsables. L’application web est développée par un·e développeur·euse sélectionné·e via Studi.

---

## 🌱 Stack & Outils

- **Framework** : React 19 + Vite + TypeScript  
- **UI / Design** : MUI (material, icons, lab, date‑pickers) & Emotion  
- **Formulaires** : react‑hook‑form + Zod + @hookform/resolvers  
- **Gestion d’état** : Redux Toolkit + react‑redux  
- **Librairies utilitaires** : date‑fns, clsx, recharts  
- **Auth & Backend** : Firebase, JWT (jwt‑decode), Axios  
- **Notifications** : notistack + react‑toastify  
- **Tests** : Vitest + Testing Library + Jest‑DOM + axios‑mock‑adapter  
- **Qualité de code** : ESLint (préconfig avec Prettier), Prettier  
- **Bundler** : Vite 6.x  

---

## 📁 Structure du projet

```text
src/
├── api
│   └── axios.ts
├── assets
│   └── images, illustrations, logos…
├── components/
│   ├── auth, booking, dashboard, admin/, …
│   └── vehicle, trip, profile, review, filters, etc.
├── hooks/           (useTrip, useBookings, useAdmin, etc.)
├── services/        (authService, tripService, userService…)
├── pages/           (Home, FindTripPage, Dashboard, AdminDashboard…)
├── router/          (AppRouter, ProtectedRoute, AdminRoute…)
├── providers/       (ToastProvider, Firebase init…)
├── store/           (Redux store & authSlice)
├── types/, constants/, utils/, validations/, forms/, layouts/, styles/
└── __tests__/       (tests unitaires pour chaque dossier)
````

Cette structure est conçue pour une maintenabilité optimale, testabilité, et modularité.

---

## ⚙️ Installation & usage

### Prérequis

* **Node.js** v22.15.0 recommandé (navetteur de performance V8)
* (Optionnel) nvm

### Installation

```bash
git clone <REPO_URL>
cd frontend
npm install
```

### Variables d’environnement

Crée un fichier `.env` à la racine avec :

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Commandes

* `npm run dev` – lancement en mode dev (localhost:5173)
* `npm run build` – build complet (TypeScript + Vite)
* `npm run preview` – aperçu du build
* `npm run lint` / `lint:fix` – vérifications / corrections ESLint
* `npm run format` – formatage Prettier
* `npm test` – lancement des tests avec Vitest
* `npm run test:coverage` – rapport couverture de tests

---

## 🔐 Authentification & Backend

* L’application utilise **Firebase** pour l’authentification (email, JWT) et le stockage des trajets, utilisateurs, etc.
* L’objet `firebaseConfig.ts` initialise Firebase SDK via les variables VITE\_ en `.env`.
* `authService.ts` gère l’inscription, login, token, déconnexion.
* Les requêtes vers l’API (Backend) sont effectuées via `axios.ts`, avec gestion CSRF, tokens JWT, erreurs, etc.

---

## 🖼️ UI & flux utilisateurs

*(à compléter avec captures d’écran)*

* Page d’accueil avec illustration (assets/bg-home.jpg / .webp)
* Recherche/filtre de trajets (date, passagers, préférences)
* Liste des trajets disponibles (`TripCard`)
* Modal de réservation (`BookingDialogContent`)
* Dashboard utilisateur : historique, profil, préférences
* Espace Admin : gestion des utilisateurs, trajets, stats

---

## 🚀 Déploiement

Les options envisagées :

* **Netlify** / **Vercel** : build & déploiement automatisé à chaque push sur `main`
* **Firebase Hosting** : bon écosystème avec Firebase Auth / Firestore
* Pense à configurer les règles CORS pour Axios / API

---

## 🔄 CI / CD

* ✅ Utilisation possible de **GitHub Actions** :

  * `lint` + `test` + `coverage` sur chaque push/pull request
  * Déploiement automatique sur staging/prod
* Option : **Dependabot** ou **Renovate** pour la mise à jour des dépendances

---

## 📦 État des dépendances

* ✅ **À jour** : React 19.x, Vite 6.x, MUI 7.x
* ⚠️ **À vérifier** : Firebase 11.8.1, axios 1.9.0, date‑fns 4.1.0, Hook Form, Zod, etc.
* 👉 Pense à `npm outdated` + tests de régression réguliers

---

## ✍️ Contribution

1. Fork le repository
2. Crée une branche feature (ex: `feature/login-ui`)
3. Commits avec messages clairs
4. Ouvre une PR vers `develop`
5. CI exécute tests, lint, coverage
6. Merge après revue validée

---

## 🚥 Prochaines évolutions

* Internationalisation (react-i18next)
* Ajout de rôles plus fins (chauffeur, admin, passager)
* Optimisations performance (lazy-loading, suspense, code splitting)
* Amélioration accessibilité (a11y)

---

## 🧑‍💻 Contact

Pour toute question, contact : **Jyzee (CTO EcoRide)** ou créateur·rice du projet.

---

**README généré automatiquement — à personnaliser selon besoins.**

```

---

### Prochaine étape

- Ajoute **captures d’écran** et remplace `<REPO_URL>`  
- Confirme les instructions de déploiement (Netlify, Firebase, etc.)  
```
