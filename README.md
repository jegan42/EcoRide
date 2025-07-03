### GO TO : **[🇫🇷 Version française](./README-FR.md)**

#### **[Main README](./README-MAIN-EN.md)**

#### **[Frontend – React](./frontend/README-FRONTEND-EN.md)**

#### **[Backend – Express / Prisma](./backend/README-BACKEND-EN.md)**

---

## 🚗 Project Overview: **EcoRide**

**EcoRide** is a web application for **eco-friendly carpooling** designed to connect drivers and passengers with a focus on green mobility. The interface highlights trips using electric vehicles and aims to be simple, modern, and intuitive.

It handles:

-   User roles: visitors, passengers, drivers, staff, administrators
-   Trip organization (creation, booking)
-   Credit and payment management
-   User reviews and moderation
-   An admin dashboard to manage the platform

---

## 🧠 Technical Choices

The technology stack was chosen with several goals in mind:

-   Build a **modern, fast, and accessible web application**
-   Facilitate **cloud deployment** (Render hosting, Neon database)
-   Offer a **smooth UX** on both desktop and mobile
-   Ensure good **maintainability and scalability**

We chose a **fullstack JavaScript/TypeScript** architecture split into two main parts: a **React SPA frontend** and a **secure Node/Express REST API**. Data is centralized in a **PostgreSQL** database managed via the Prisma ORM.

---

## 🌐 Online Access

-   [🌍 Live API (Backend)](https://ecoride-c6c1.onrender.com/)
-   [🖥️ Live Admin Interface (Frontend)](https://ecoride-frontend-5cro.onrender.com/admin)

---

## 📘 Quick Documentation

📄 This repository includes all project documentation:

-   [Main README](./README-MAIN-EN.md)
-   [Frontend – React](./frontend/README-FRONTEND-EN.md)
-   [Backend – Express / Prisma](./backend/README-BACKEND-EN.md)

---

## ⚙️ Tech Stack

| Part                     | Main Technology            | Why this choice?                               |
| ------------------------ | -------------------------- | ---------------------------------------------- |
| **Frontend**             | React, TypeScript, MUI     | Modular components, performance, accessibility |
| **Backend**              | Node.js, Express, Prisma   | Simple, fast, strict typing with TS            |
| **Database**             | Neon (PostgreSQL)          | Scalable, serverless, cloud-native             |
| **Firebase (Firestore)** | NoSQL for reviews/messages | Real-time, simple, Firebase-native             |
| **Deployment**           | Render                     | Easy, free, CI/CD friendly                     |

---

### 🖥️ Frontend

| Technology           | Role                     | Why this choice?                     |
| -------------------- | ------------------------ | ------------------------------------ |
| **Vite**             | Dev server & bundler     | Fast, modern alternative to CRA      |
| **React**            | UI SPA framework         | Popular, component-based, responsive |
| **TypeScript**       | Static typing            | Fewer errors, better editor support  |
| **@mui/material**    | UI components            | Accessible, modular design system    |
| **React Hook Form**  | Form handling            | Fast, ergonomic, and efficient       |
| **Redux Toolkit**    | State management         | Centralized and simplified           |
| **Axios**            | HTTP requests            | Interceptors, ease of use            |
| **React Router DOM** | SPA routing              | Smooth navigation between pages      |
| **Zod**              | Client-side validation   | Type-safe, integrated with RHF       |
| **Vitest + RTL**     | Unit & component testing | Fast, user-centric tests             |

---

### 🛠️ Backend (Render)

| Technology                     | Role                 | Why this choice?                         |
| ------------------------------ | -------------------- | ---------------------------------------- |
| **Node.js**                    | JavaScript runtime   | Async, performant                        |
| **Express**                    | Web framework        | Lightweight, extendable                  |
| **TypeScript**                 | Static typing        | Secure, maintainable                     |
| **Prisma ORM**                 | ORM                  | Type-safe, simple migrations             |
| **Neon (PostgreSQL)**          | Cloud DB             | Serverless PostgreSQL, Render compatible |
| **Passport.js + Google OAuth** | Authentication       | Standard, secure, centralized auth       |
| **jsonwebtoken (JWT)**         | Token-based auth     | Fast, secure, portable                   |
| **express-session**            | Persistent sessions  | Required for long-lived sessions         |
| **cookie-parser**              | Read/write cookies   | Needed for auth/session                  |
| **bcrypt**                     | Password hashing     | Safe, proven                             |
| **helmet**                     | Secure HTTP headers  | Protects against XSS and other threats   |
| **csurf**                      | CSRF protection      | Needed in stateful setups                |
| **express-rate-limit**         | Rate limiting        | Prevents brute-force attacks             |
| **express-validator**          | Input validation     | Ensures robust, secure APIs              |
| **dotenv**                     | Env var management   | Separate env/dev/prod configs            |
| **firebase-admin**             | Firestore access     | Token access for frontend use            |
| **resend**                     | Transactional emails | Easy-to-use email API                    |

---

### 🧪 Testing

| Tool                      | Role                       | Why this choice?            |
| ------------------------- | -------------------------- | --------------------------- |
| **Vitest** (frontend)     | Unit & component tests     | Fast, Vite-integrated       |
| **React Testing Library** | User-centric React testing | Focus on real user behavior |
| **Supertest** (backend)   | API route testing          | Works well with Express     |
| **Jest** (backend)        | Main test runner           | Powerful and full-featured  |
| **ts-jest**               | TS support for Jest        | TypeScript testing support  |

---

### 🗃️ Database

| Technology             | Role                     | Why this choice?                         |
| ---------------------- | ------------------------ | ---------------------------------------- |
| **Neon**               | PostgreSQL Cloud         | Serverless, free, Render-compatible      |
| **Firebase Firestore** | NoSQL for real-time data | Messaging, reviews, live notifications   |
| **Prisma**             | ORM                      | Typed schema, migrations, simple queries |

---

### 🔐 Security & Emailing

| Tool                | Role                 | Why this choice?               |
| ------------------- | -------------------- | ------------------------------ |
| **Multer** (coming) | File uploads         | Supports `multipart/form-data` |
| **Resend**          | Transactional emails | Easy, SMTP/API support         |
| **bcrypt**          | Hashing              | Secure password storage        |

---

### ☁️ Deployment

| Platform                 | Role                       | Why this choice?                 |
| ------------------------ | -------------------------- | -------------------------------- |
| **Render**               | Frontend & backend hosting | Free, easy, CI/CD-friendly       |
| **Neon**                 | PostgreSQL DB              | Serverless, good free tier, fast |
| **GitHub Actions** (opt) | CI/CD                      | Auto run tests, build, lint      |
| **deSEC.io**             | Free DNS/sublinks          | Dynamic domains like `.dedyn.io` |
| **Improvmx**             | Email redirection          | Free forwarding to real inboxes  |

---

## 📁 Project Structure

```
/ecoride
│
├── README-MAIN-FR.md         → Main project documentation
├── /backend                  → Express + Prisma backend
│   ├── README-BACKEND-FR.md  → Backend-specific info
│   ├── /controllers          → Business logic
│   ├── /routes               → API routes
│   ├── /middlewares          → Auth, errors, CSRF, etc.
│   ├── /prisma               → DB schema + seeding
│   └── app.ts                → Backend entry point
│
├── /frontend                 → React frontend (Vite)
│   ├── README-FRONTEND-FR.md → Frontend-specific info
│   ├── /components           → Reusable components
│   ├── /pages                → App pages
│   ├── /store                → Redux state management
│   └── main.tsx              → Frontend entry point
│
└── .env                      → Environment variables
```

---

## 🔧 Local Setup

### Prerequisites

-   Node.js v20+
-   npm v9+
-   PostgreSQL or a Neon account
-   Git

### Clone the project

```bash
git clone https://github.com/jegan42/EcoRide.git
cd ecoride
```

### Install dependencies

```bash
cd backend && npm install      # Backend
cd ../frontend && npm install  # Frontend
```

### Environment config (`.env`)

#### In `/backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ecoride
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:5173
```

#### In `/frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

### Initialize the database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

---

## 🚀 Run the App Locally

### Start the API

```bash
cd backend
npm run dev
# Accessible at http://localhost:3000
```

### Start the frontend

```bash
cd frontend
npm run dev
# Accessible at http://localhost:5173
```

---

## 🔐 Default Admin Account

During DB seed (`prisma/seed.ts`), a default admin is created:

-   **Email**: `adminfortest@ecoride.dedyn.io`
-   **Password**: `Mon@email.123`

> 🔒 Password is hashed via **bcrypt**. Change it after first login.

---

## 📊 Main Use Cases

### Users

-   Sign up as a passenger
-   Add a vehicle (becomes driver)
-   Edit profile
-   View past/upcoming trips

### Drivers

-   Post a trip
-   Edit/cancel trips
-   Manage requests

### Passengers

-   Search for trips
-   Book a seat
-   Rate the trip

### Staff / Admin

-   Manage user accounts
-   Moderate reviews
-   Respond to messages
-   Track analytics

---

## 🧭 Diagrams

### ✅ Use Case Scenarios

-   [Scenario 1 – Login](./doc/DATABASE_7A_Diagramme_de_séquence.png)
-   [Scenario 2 – Driver posts a trip](./doc/DATABASE_7B_Diagramme_de_séquence)
-   [Scenario 3 – Trip reservation](./doc/DATABASE_7C_Diagramme_de_séquence)

### 🗃️ Data Modeling

-   [DATABASE](./doc/database.sql)
-   [Tables Definition](./doc/DATABASE_1_Définition_des_tables%28entités%29.pdf)
-   [Fields + Types + Constraints](./doc/DATABASE_2_Champs_types_contraintes%28tableaux_détaillés%29.pdf)
-   [Conceptual Data Model (Text)](./doc/DATABASE_3_MCD%28Modèle_Conceptuel_de_Données%29version–textuelle.pdf)
-   [Conceptual Data Model (Visual)](./doc/DATABASE_4_MCD%28Modèle_Conceptuel_de_Données%29version_visuel.png)
-   [UML Class Diagram](./doc/DATABASE_5_Diagramme_UML_de_classes.png)
-   [Usage Diagram](./doc/DATABASE_6_Diagramme_d_utilisation.png)

---

## 🎨 Style Guide

-   [Visual Guide](./doc/Page_Charte_Graphique.pdf)
-   [UX Annotations](./doc/Page_Annotation_UX.pdf)
-   [FIGMA](https://www.figma.com/design/7lTQWwT0os4P9HB8NNlPjJ/Projet-EcoRide---ECF-DWWM?node-id=3-2&t=SYm7u2FFSCxxXrk1-0)

### Fonts

-   **Poppins** – [Google Fonts](https://fonts.google.com/specimen/Poppins)

### Primary Colors

| Color     | Usage                  |
| --------- | ---------------------- |
| `#A5D6A7` | Eco green (primary)    |
| `#2E7D32` | Forest green (buttons) |
| `#F5F5F5` | Light calm background  |
| `#263238` | Main text              |
| `#FFFFFF` | Cards / secondary BG   |

### Logo

-   [EcoRide Logo](./doc/ecoride_logo.png)  
    A stylized **leaf in a car** – minimalist and evocative.

---

## 📱 Wireframes

Contents:

-   Homepage (trip search)
-   Booking form
-   [FIGMA](https://www.figma.com/design/7lTQWwT0os4P9HB8NNlPjJ/Projet-EcoRide---ECF-DWWM?node-id=3-2&t=SYm7u2FFSCxxXrk1-0)

---

## 📌 Project Management & Collaboration

-   [TRELLO Board](https://trello.com/b/RdURamDs/projet-ecoride-ecf-dwwm)
