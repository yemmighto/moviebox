# MovieBox (Demo Movie Streaming App)

A responsive movie streaming website inspired by MovieBox. This is a **demo/portfolio** project: it uses **TMDB metadata** and **official YouTube trailers**. For streaming, it only uses **dummy/public-domain/sample video sources** (no hosting of copyrighted full movies).

## What’s built so far

### Frontend (React + Vite)
- Routing with React Router
- Auth flow (JWT) via `AuthContext`
- Pages:
  - Home (`/`)
  - Login (`/login`)
  - Register (`/register`)
  - Profile (`/profile`)
  - Browse/Search (`/search`)
  - Movie Details (`/movies/:id`)
  - Watch (`/watch/:id`)
  - Watchlist (`/watchlist`)
  - Admin (`/admin`) 
- Reusable components:
  - `Navbar`-style layout is handled via page structure (see `apps/web/src/components/`)
  - `MovieCard`, `MovieRow`, `SectionTitle`
  - `ProtectedRoute`
- API client layer in `apps/web/src/api/`
  - Axios wrappers for movies/auth/watchlist/admin

### Backend (Node.js + Express + MongoDB)
- Express API with JWT authentication
- MongoDB models:
  - `User`
  - `Movie` (metadata/cache-friendly)
- Routes:
  - Auth (`/api/auth/...`)
  - Movies + TMDB proxy (`/api/movies/...`)
  - Watchlist (protected)
  - Admin endpoints (optional / protected)
- TMDB integration wrapper:
  - `apps/api/src/services/tmdbClient.js`
- Middleware:
  - DB connection (`requireDB`)
  - Auth (`auth.js`)
  - Admin gating (`requireAdmin.js`)

### Repo structure (monorepo)
- `apps/web` – React frontend
- `apps/api` – Express backend
- `packages/shared` – shared types/config (if needed)

## Tech stack
- **Frontend:** React, Vite, React Router, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT
- **API:** TMDB (metadata + trailers)
- **Styling:** Tailwind CSS

## Key principles (legal safety)
- Do **not** host copyrighted full movies.
- Use:
  - TMDB for metadata (titles, posters, genres, cast, etc.)
  - Official YouTube trailer embeds
  - Public-domain/sample/dummy videos for any demo playback

## Getting started

### 1) Prerequisites
- Node.js 18+ recommended
- MongoDB (local or Atlas)
- TMDB API key

### 2) Environment variables
Create env files (the project expects workspace-level envs; see each package):

#### Backend (`apps/api`)
- `JWT_SECRET` (required)
- `MONGODB_URI` (required)
- `TMDB_API_KEY` (required for TMDB features)

#### Frontend (`apps/web`)
- Frontend should be configured to point to the backend API base URL (via existing `apps/web/src/api/http.js` or Vite env vars).

> If you want, add a root `.env.example` later for convenience.

### 3) Install dependencies
From `/Users/mac/Desktop/MovieBox`:
```bash
npm install
```

### 4) Run dev servers (web + api concurrently)
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

### 5) Build frontend
```bash
npm run build --workspace @moviebox/web
```

## API endpoints (high-level)
- Health (if implemented): `GET /api/health`
- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/profile` (protected)
- Movies:
  - `GET /api/movies` (search/filter/pagination)
  - `GET /api/movies/:id` (single + similar)
  - `GET /api/movies/trending` (top)
- Watchlist (protected):
  - `POST /api/watchlist/add`
  - `DELETE /api/watchlist/remove/:movieId`
  - `GET /api/watchlist`
- Admin (optional/protected):
  - Admin enable/admin routes exist in `apps/api/src/routes/`

> Exact request/response shapes are implemented inside each route file under `apps/api/src/routes/`.

## Frontend architecture
- `AuthContext.jsx`
  - Stores user session (JWT) and exposes auth actions to components/pages.
- `ProtectedRoute.jsx`
  - Redirects unauthenticated users away from protected pages.
- `apps/web/src/api/*`
  - Centralized API calls using Axios.

## Backend architecture
- `apps/api/src/index.js`
  - App bootstrap, middleware, route mounting, server listen.
- `apps/api/src/config/db.js`
  - MongoDB connection.
- `apps/api/src/routes/*`
  - Route handlers.
- `apps/api/src/middleware/*`
  - Auth/DB/admin middleware.
- `apps/api/src/services/tmdbClient.js`
  - TMDB API wrapper.

## Notes / common issues
- Port conflicts can happen during dev (5173 for Vite, 4000 for Express). If you see `EADDRINUSE`, stop the process using the port and restart.

## Next steps (from the TODO)
- Complete core UI pages polish + empty/loading states
- Implement/validate watch playback using dummy/public sample sources only
- Add watch progress (optional)
- Optional Stripe premium tier enforcement
- Optional comments system


