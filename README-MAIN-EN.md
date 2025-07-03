### GO TO : **[🇫🇷 Version française](./README-MAIN-FR.md)**

#### **[Project Overview](./README.md)**

#### **[Frontend – React](./frontend/README-FRONTEND-EN.md)**

#### **[Backend – Express / Prisma](./backend/README-BACKEND-EN.md)**

---

# 🚗 EcoRide — Modern Carpooling Platform

*EcoRide is a secure, responsive, and user-friendly platform that simplifies finding, booking, and managing carpool rides between individuals.*

---

## 🧱 Project Structure

The project is divided into two main parts, each with its own codebase and documentation:

* **Frontend** — A modern React SPA (TypeScript) using Vite, Redux, Material UI, and Firebase (for reviews & history).
* **Backend** — A secure REST API built with Node.js / TypeScript using Express, Prisma, PostgreSQL (Neon), Passport (Google OAuth), CSRF protection, role-based access control, and more.

---

## ⚙️ Tech Stack & Reasoning

| Side     | Choice                              | Main Reasoning                                       |
| -------- | ----------------------------------- | ---------------------------------------------------- |
| Frontend | **React 19 + Vite**                 | Performance, rich ecosystem, TypeScript typing       |
|          | **Material UI (MUI)**               | Consistent and customizable design system            |
|          | **Redux Toolkit**                   | Centralized state management, simple slice handling  |
|          | **React Hook Form + Zod**           | Efficient validation with typed schemas              |
|          | **React Router v7**                 | Routing with secure access control (admin/protected) |
| Backend  | **Node.js + Express 5**             | Lightweight, flexible, middleware-first              |
|          | **Prisma ORM + PostgreSQL**         | Modern ORM, TypeScript typing, optimized queries     |
|          | **Neon (PostgreSQL Cloud)**         | Simplified cloud deployment, Prisma compatible       |
|          | **Passport.js**                     | Robust Google OAuth 2.0 authentication               |
|          | **Firebase**                        | NoSQL storage for reviews & history                  |
| Security | **CSURF, Helmet, express-session**  | Request, session & cookie security, traffic limiting |
| Emails   | **Resend API**                      | Simple and secure transactional email sending        |
| Tests    | **Vitest / RTL / Jest / Supertest** | Frontend and backend unit & integration testing      |

---

## 🛠️ Installation & Local Setup

### 1. Prerequisites

* Node.js `>= 20`
* npm `>= 9`
* PostgreSQL (Neon used in production, local in dev)
* Firebase account (temporary)

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in sensitive variables (see below)
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Fill in environment variables (API_URL, Firebase, etc.)
npm run dev
```

---

## 🧪 Environment Configuration

### 🔧 ESLint & Prettier

* Shared config between frontend & backend (`Airbnb`, `Prettier`, `React`, `TypeScript`)
* Linting runs automatically before every commit (`husky` possible in CI/CD)

### 🧰 Tools Used

| Tool             | Purpose                              |
| ---------------- | ------------------------------------ |
| ESLint           | Static code analysis                 |
| Prettier         | Automatic code formatting            |
| Vitest + RTL     | Frontend unit testing                |
| Jest + Supertest | Backend testing (routes, middleware) |
| Vite             | Fast, modern build tool (frontend)   |
| ts-node-dev      | Fast backend reload in dev           |

### 📁 Folder Structure

```
/
├── frontend/         # React SPA with Vite, Redux, MUI
│   └── src/          # Components, pages, hooks, router, store, etc.
├── backend/          # Node.js + Express API
│   ├── src/          # Routes, middlewares, controllers
│   ├── prisma/       # Schema & seed SQL
├── .env.example      # Sample environment variables
├── README.md         # Main README
```

---

## 🧩 Project Management Methodology

* **Method**: Agile with Kanban inspiration
* **Tracking**: Trello organized by backlog, to dev, in progress, finish, Prod
* **Sprint length**: 5-7 days with prioritization of major features
* **Intermediate deliverables**:

  * Functional MVP without payments
  * Progressive addition of dashboards (admin / employee)

* **Versioning**: Conventional Git commits (`feat`, `fix`, `refactor`, etc.)

---

## 📋 Key Features

* Advanced trip search with filters (date, energy type, price, etc.)
* Booking, cancellation, passenger management
* Vehicle, trip, and user preferences management
* User dashboard: profile, history, reviews, no-shows
* Admin dashboard: users, trips, stats, moderation
* Authentication: Google OAuth or classic account (JWT)
* Toast notifications, user feedback, responsive design

---

## 🛢️ Database & Third-Party Services

* **PostgreSQL (Neon)** — Relational data storage via Prisma ORM
* **Firebase Firestore** — Use for:

  * User reviews
  * Trip history
  * Contact form
* **Resend API** — Admin and confirmation email sending

---

## 👤 Author

> Solo project developed by **Jyzee** with a modular, secure, responsive, and UX-oriented approach.

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](#)
