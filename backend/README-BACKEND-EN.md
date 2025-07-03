### GO TO : **[🇫🇷 Version française](./README-BACKEND-FR.md)**

#### **[Project Overview](../README.md)**

#### **[Main README](../README-MAIN-EN.md)**

#### **[Frontend – React](../frontend/README-FRONTEND-EN.md)**

---

# 🚀 EcoRide — Backend

Backend REST API built with **Node.js** and **TypeScript** for _EcoRide_, a privacy-first, secure, and scalable carpooling platform.

---

## 📚 Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Authentication & Security](#2-authentication--security)
3. [Database](#3-database--orm)
4. [API Endpoints](#4-api-endpoints)
5. [Project Structure](#5-code-structure)
6. [Running Locally](#6-running-locally)
7. [Testing & Quality](#7-testing--quality)
8. [User Roles](#8-user-roles)
9. [Environment Variables](#9-environment-variables)
10. [Deployment Plan](#10-deployment-plan)
11. [Future Improvements](#11-future-improvements)
12. [Author](#author)

---

## 1. Tech Stack

| Tech                   | Version  | Use Case                                       |
| ---------------------- | -------- | ---------------------------------------------- |
| **Node.js**            | 22.x     | High-perf async backend runtime                |
| **TypeScript**         | ~5.2     | Type safety, better tooling & maintainability  |
| **Express**            | 5.1.0    | Minimal, performant HTTP routing layer         |
| **Prisma ORM**         | 6.7.0    | Elegant DB access with auto-generated types    |
| **Neon (PostgreSQL)**  | external | Scalable, cloud-native PostgreSQL (serverless) |
| **Passport.js**        | 0.7.0    | Google OAuth 2.0 strategy                      |
| **Firebase Admin SDK** | 13.4.0   | Only used for generating frontend auth tokens  |
| **Helmet**             | 8.1.0    | Secures headers (CSP, XSS, etc.)               |
| **express-session**    | 1.18.1   | Cookie-based sessions                          |
| **Rate Limiter**       | 7.5.0    | Throttle traffic to prevent abuse              |
| **Resend**             | API      | Transactional emails (contact, notifications)  |

---

## 2. Authentication & Security

- 🔐 **Sessions** via secure cookies (SameSite + HTTPOnly)
- 🔐 **Google OAuth 2.0** using Passport
- 🧾 **JWT** internally for user logic / frontend Firebase access
- 🛡️ **CSRF** protection via `csurf`
- 📦 **Rate limiting** per route and per role
- ⚙️ **Helmet** for advanced CSP and security headers
- 🧯 **Detailed logging** with `morgan`
- 📧 Emails securely sent via **Resend API**

---

## 3. Database & ORM

- **Database:** Hosted PostgreSQL on [Neon.tech](https://neon.tech)
- **ORM:** Prisma with full type coverage

### Entities & Relations

- `User`, `Trip`, `Booking`, `Vehicle`, `UserPreferences`

### 🔑 Firebase usage:

> Firebase is **only used in the backend** to generate frontend-auth tokens (custom JWT for frontend Firebase auth).  
> No Firebase database is used in backend logic.

---

## 4. API Endpoints

<details>
<summary><strong>👤 Auth</strong></summary>

```http
POST   /api/auth/signup
POST   /api/auth/signin
POST   /api/auth/signout
PUT    /api/auth/update
GET    /api/auth/me
GET    /api/auth/all         # admin only
```

</details>

<details>
<summary><strong>🚘 Vehicles</strong></summary>

```http
POST   /api/vehicles/
GET    /api/vehicles/
GET    /api/vehicles/:id
PUT    /api/vehicles/:id
DELETE /api/vehicles/:id
```

</details>

<details>
<summary><strong>🛣️ Trips</strong></summary>

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
<summary><strong>📆 Bookings</strong></summary>

```http
POST   /api/bookings/
DELETE /api/bookings/:id
GET    /api/bookings/me
GET    /api/bookings/driver
POST   /api/bookings/:id/validate
```

</details>

<details>
<summary><strong>⚙️ Preferences</strong></summary>

```http
POST   /api/preferences/
GET    /api/preferences/me
GET    /api/preferences/:id
PUT    /api/preferences/
DELETE /api/preferences/
```

</details>

<details>
<summary><strong>🔑 Firebase Token</strong></summary>

```http
GET    /api/firebase-token
```

</details>

---

## 5. Code Structure

```
src/
├── controllers/      # Route logic
├── services/         # Business logic
├── routes/           # Express routers
├── validators/       # Input schemas
├── middleware/       # Auth, CSRF, error handlers
├── firebase/         # Custom token generator
├── passport/         # Google OAuth strategy
├── types/            # TS types/extensions
├── tests/            # Jest + Supertest
```

---

## 6. Running Locally

### 🛠 Requirements

- Node.js 20+ (preferably 22)
- PostgreSQL connection (Neon or local)
- Firebase service account JSON

### ▶️ Steps

```bash
# 1. Clone the repo
git clone https://github.com/your-org/ecoride.git

# 2. Install dependencies
cd ecoride/backend
npm install

# 3. Configure your .env file
cp .env.example .env
# Fill in your variables

# 4. Run Prisma migrations (optional)
npx prisma db push

# 5. Start the server
npm run dev
```

---

## 7. Testing & Quality

- ✅ Unit & integration tests: `Jest` + `Supertest`
- ✅ Linting: `eslint`, `prettier`

### Useful scripts

```bash
npm run dev         # Dev server
npm run test        # Run all tests
npm run test:cov    # Generate test coverage
npm run lint:fix    # Fix lint errors
```

---

## 8. User Roles

| Role        | Description                                    |
| ----------- | ---------------------------------------------- |
| `passenger` | Can book trips, update profile/preferences     |
| `driver`    | Can create trips, view bookings, validate them |
| `admin`     | Full access to user/trip/booking management    |
| `suspended` | Guest-like visitor                             |
| `employee`  | Reserved for future moderation tools           |

---

## 9. Environment Variables

> See `.env.example` for a full list.

```env
PORT=5000
NODE_ENV=development

DATABASE_URL=postgresql://...

JWT_SECRET=your-jwt-secret
SESSION_SECRET=session-secret
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

## 10. Deployment Plan

> 🌱 Initial deployment is local. Production via:

- 🐳 [Render](https://render.com) for fullstack deployment
- 🐘 [Neon](https://neon.tech) for PostgreSQL (serverless)
- 🔐 Environment managed via `.env` or secrets manager

---

## 11. Future Improvements

- [ ] Stripe payment integration

---

## Author

Built by **Jyzee**
Clean code, modular design, and a focus on security, performance, and testability.

> All commits follow `feat`, `fix`, \`ref
