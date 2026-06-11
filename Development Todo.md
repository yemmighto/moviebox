# MovieBox Website – Development Todo

## Project Overview
Build a fully functional movie streaming website inspired by MovieBox.

**Tech Stack Suggestions:** React (Frontend), Node.js/Express (Backend), MongoDB (Database), Tailwind CSS (Styling), TMDB API (Movie data), JWT (Auth), Stripe (Optional payments for premium).

**Goal:** Create a responsive web app where users can browse movies, watch trailers, read details, and (if legally permissible) stream actual content using embedded sources or your own hosted videos (for demo/portfolio purposes, use dummy/public domain videos).

---

## 1. Project Setup & Planning

- [ ] 1.1 Define core features (see Section 2)
- [ ] 1.2 Choose tech stack & create repo structure
- [ ] 1.3 Set up development environment (React + Node.js concurrently)
- [ ] 1.4 Install dependencies (axios, react-router-dom, mongoose, jsonwebtoken, bcryptjs, dotenv, cors, etc.)
- [ ] 1.5 Configure ESLint + Prettier
- [ ] 1.6 Create folder structure:
  - [ ] `apps/web` (React)
  - [ ] `apps/api` (Express)
  - [ ] `packages/shared` (optional shared types/constants)
- [ ] 1.7 Add environment templates:
  - [ ] `.env.example` (web)
  - [ ] `.env.example` (api)
- [ ] 1.8 Add dev tooling:
  - [ ] `concurrently` / `npm-run-all`
  - [ ] `nodemon` (API)
- [ ] 1.9 Add CI basics (optional): `lint` + `test` scripts

---

## 2. Core Features (MVP)

- [ ] 2.1 Public browsing
  - [ ] Movie grid (search + sort)
  - [ ] Categories/genres
  - [ ] Pagination or infinite scroll
- [ ] 2.2 Movie details
  - [ ] Title, poster/backdrop, genres, release date, rating
  - [ ] Trailer section (embed/link)
  - [ ] Cast/crew (optional)
- [ ] 2.3 Watch page
  - [ ] Player UI (use public domain / dummy sources)
  - [ ] Related movies carousel
- [ ] 2.4 Authentication (JWT)
  - [ ] Register
  - [ ] Login
  - [ ] Protected routes (premium and/or watch features)
- [ ] 2.5 User profile (basic)
  - [ ] Update profile (optional)
  - [ ] View watch history (optional)
- [ ] 2.6 Premium plan (optional)
  - [ ] Stripe checkout session
  - [ ] Upgrade/downgrade flow
  - [ ] Restrict premium endpoints
- [ ] 2.7 Admin (optional)
  - [ ] Manage movie catalog overrides (if needed)

---

## 3. Backend (Express + MongoDB)

- [ ] 3.1 Initialize API
  - [ ] Express app + middleware (cors, json)
  - [ ] Health endpoint: `GET /api/health`
- [ ] 3.2 MongoDB setup
  - [ ] Connection + config
  - [ ] Mongoose models:
    - [ ] `User`
    - [ ] `Movie` (optional cache)
    - [ ] `WatchHistory` (optional)
    - [ ] `Subscription` (optional)
- [ ] 3.3 Auth
  - [ ] Password hashing (bcryptjs)
  - [ ] JWT issuing + verification middleware
  - [ ] `requireAuth` middleware
  - [ ] Rate limiting (optional)
- [ ] 3.4 TMDB integration
  - [ ] Client wrapper (`tmdbClient.js`)
  - [ ] Endpoints (examples):
    - [ ] `GET /api/movies/popular`
    - [ ] `GET /api/movies/search?q=`
    - [ ] `GET /api/movies/:id`
    - [ ] `GET /api/movies/:id/trailers`
- [ ] 3.5 Watch content sources
  - [ ] Dummy video catalog (map movie -> url)
  - [ ] `GET /api/movies/:id/watch`
- [ ] 3.6 Validation & errors
  - [ ] Request validation (zod/joi or express-validator)
  - [ ] Central error handler
- [ ] 3.7 Security
  - [ ] Helmet (optional)
  - [ ] CORS policy
  - [ ] Store secrets in env
- [ ] 3.8 Automated tests (optional)
  - [ ] Jest + Supertest

---

## 4. Frontend (React + Tailwind)

- [ ] 4.1 Initialize web app
  - [ ] Routing with `react-router-dom`
  - [ ] Global layout (Navbar, Footer)
- [ ] 4.2 API client layer
  - [ ] Axios instance with interceptors
  - [ ] Auth token injection
- [ ] 4.3 Public pages
  - [ ] Home page (popular + categories)
  - [ ] Search page
  - [ ] Genre pages
- [ ] 4.4 Movie details page
  - [ ] Fetch + render movie info
  - [ ] Trailer embed
- [ ] 4.5 Watch page
  - [ ] Video player
  - [ ] Related carousel
- [ ] 4.6 Auth pages
  - [ ] Login page
  - [ ] Register page
- [ ] 4.7 Protected routes
  - [ ] Redirect unauthenticated users
  - [ ] Premium gating (optional)
- [ ] 4.8 Styling
  - [ ] Tailwind config + theme
  - [ ] Responsive layouts
  - [ ] Loading skeletons
- [ ] 4.9 Quality
  - [ ] ESLint + Prettier + lint scripts
  - [ ] Basic unit tests (optional)

---

## 5. Integration & Environment

- [ ] 5.1 Local dev setup
  - [ ] Run API and Web concurrently
  - [ ] Proxy/base URLs configuration
- [ ] 5.2 CORS + cookies/token strategy
  - [ ] Choose Authorization header vs cookies
- [ ] 5.3 Build & run
  - [ ] `npm run build` (web)
  - [ ] `npm run start` (api)

---

## 6. Optional: Stripe Premium

- [ ] 6.1 Stripe setup
  - [ ] Create products/prices
  - [ ] Webhook endpoint verification
- [ ] 6.2 Checkout flow
  - [ ] `POST /api/stripe/checkout` (authenticated)
  - [ ] Return checkout URL/session
- [ ] 6.3 Premium enforcement
  - [ ] Middleware: `requirePremium`
  - [ ] Gate watch page or streaming endpoints

---

## 7. Deployment (Optional)

- [ ] 7.1 Choose hosting
  - [ ] Vercel/Netlify for web
  - [ ] Render/Fly/Heroku for API
  - [ ] MongoDB Atlas
- [ ] 7.2 Production env setup
  - [ ] secrets in hosting provider
  - [ ] TMDB + Stripe keys
- [ ] 7.3 Add production build checks

---

## 8. Acceptance Checklist (MVP)

- [ ] User can register and login
- [ ] User can browse movies (popular + search)
- [ ] User can open a movie details page
- [ ] User can watch a dummy video from the watch page
- [ ] Watch page route can be protected (optional)
- [ ] Responsive UI on mobile/desktop

