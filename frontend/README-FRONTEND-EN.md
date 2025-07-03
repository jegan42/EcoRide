### GO TO : **[🇫🇷 Version française](./README-FRONTEND-FR.md)**

#### **[Project Overview](../README.md)**

#### **[Main README](../README-MAIN-EN.md)**

#### **[Backend – Express / Prisma](../backend/README-BACKEND-EN.md)**

---

# 🚗 EcoRide — Frontend

EcoRide is a modern carpooling platform designed to connect drivers and passengers with a focus on trust, flexibility, and usability.

This frontend is built with **React 19**, **TypeScript**, **Vite**, and **Material UI**.

---

## 🚀 Stack Overview

| Tool                                             | Version  | Description                                     |
| ------------------------------------------------ | -------- | ----------------------------------------------- |
| [React](https://react.dev)                       | ^19.1.0  | Main frontend library                           |
| [Vite](https://vitejs.dev)                       | ^6.3.5   | Lightning-fast build tool                       |
| [TypeScript](https://www.typescriptlang.org)     | \~5.8.3  | Static type checking                            |
| [Material UI (MUI)](https://mui.com)             | ^7.1.2   | Component library with full design system       |
| [Redux Toolkit](https://redux-toolkit.js.org)    | ^2.8.2   | Scalable, efficient state management            |
| [React Hook Form](https://react-hook-form.com)   | ^7.56.4  | Flexible and performant form handling           |
| [Firebase](https://firebase.google.com)          | ^11.8.1  | Real-time features (history, reviews, contacts) |
| [React Router](https://reactrouter.com)          | ^7.6.1   | Routing including protected and admin routes    |
| [Zod](https://github.com/colinhacks/zod)         | ^3.25.33 | Type-safe schema validation                     |
| [Notistack](https://iamhosseindhv.com/notistack) | ^3.0.2   | Toast notification system                       |
| [Recharts](https://recharts.org/)                | ^3.0.0   | Chart library for admin statistics              |

---

## 📦 Project Structure

```
src/
│
├── api/                    # Axios instance
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── layouts/                # Page layout wrappers
├── pages/                  # Application pages (public + protected)
├── router/                 # Routing logic (ProtectedRoute, AdminRoute)
├── services/               # Data fetching (REST + Firebase)
├── store/                  # Redux store & slices
├── types/                  # TypeScript models & enums
└── utils/                  # Utility functions (formatting, guards, etc.)
```

---

## 🔐 Authentication & Security

- Authentication via **JWT** (stored securely in HttpOnly cookies with SameSite policy).
- **Firebase Auth** used temporarily for no-SQL data access.
- Google OAuth strategy integrated via `passport.js` on backend.
- CSRF protection implemented through custom middleware.
- Routes protected by `ProtectedRoute` and `AdminRoute` wrappers.

---

## 🧠 Key Features

### 🌍 Public Pages

- **Home**, **About**, **Legal Notice**, **Contact** (form integrated with Firebase)

### 👤 Authentication

- JWT login + optional Google OAuth login
- Secure protected user dashboard and admin routes

### 👤 User Dashboard

- Update **profile** and **user preferences**
- Manage **vehicles**
- Manage **trips** (create, edit, cancel)
- Make and manage **bookings** (confirm, cancel)
- Leave **reviews** and report **no-shows**
- View **trip history**

### 🚘 Trip Search

- Smart filters: energy type, rating, seats, price range, date
- Trip details with driver, vehicle, and preferences info

### ⭐️ Reviews

- Review system for **drivers** and **passengers**
- Average ratings separated by role (`asDriver` / `asPassenger`)
- No rating counted for `no_show` events

### 🕒 History

- Tracks user actions (`completed`, `cancelled`, `no_show`)
- Enriched with trip and user metadata

### 🔧 Admin Dashboard

- Admin-only secure area
- Manage **users**, **trips**, and **contacts**
- Dashboard charts: weekly signups, trip stats, user types, etc.

---

## 🖌️ UI & UX

- Built with **Material UI v7** and `@emotion` styling
- Custom theming and layout components
- Fully responsive design (mobile-first)
- Collapsible dashboard sections for clarity
- Smooth toast notifications with **notistack**

---

## 🧪 Testing & Linting

- Unit tests with **Vitest** + **React Testing Library**
- Code formatting via **Prettier**
- ESLint configured with Airbnb, React, and Prettier rules

---

## 📊 Deployment Notes

- Frontend planned for deployment on **Render**
- Backend + DB (PostgreSQL via **Neon**) also target Render
- Firebase currently used for:
  - Reviews
  - Contact form submissions
  - Trip histories

---

## ⚠️ Notes

- This is a **solo** project for learning and demo purposes.
- Firebase usage + backend APIs.
- Admin features are under ongoing development.

---

## 📌 TODO (Roadmap)

- [ ] Add password reset & account deletion features
- [ ] Implement dark mode support
- [ ] Add internationalization (FR/EN) support

---

## 🧾 License

This project is licensed under the [MIT License](LICENSE).

---

## 🧑‍💻 Author

> Built with ❤️ by Jyzee for EcoRide 🚗
