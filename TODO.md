# MovieBox – Progress Tracker

## Planned Steps (from Development Todo.md)
- [x] 1. Project Setup & Planning
- [x] 1. Project Setup & Planning
- [x] 1.1 Define core features
  - [x] 1.2 Create repo structure (apps/web, apps/api, packages/shared)
- [x] 1.3 Set up concurrent dev (web + api)
  - [x] 1.4 Install dependencies
- [x] 1.5 Configure ESLint + Prettier

- [x] 1.6 Add env templates (.env.example for web + api)




- [x] 2. Core Features (MVP)

  - [x] 2.1 User Authentication (Register / Login / Logout / Profile)

- [x] 2.2 Movie Browsing (Homepage hero, categories, search)

- [x] 2.3 Movie Details Page (Synopsis, cast, ratings, trailer, similar movies)
  - [x] 2.4 Watch / Streaming (Embed YouTube trailer + optional demo video)
- [x] 2.5 Watchlist (Add/remove movies)
  - [x] 2.6 Admin Panel (Upload movies, manage content – optional)

  - [x] 2.7 Responsive Design (Mobile/tablet/desktop)
  - [x] 2.8 Dark/Light Mode (Nice to have)


- [ ] 3. UI/UX Design – Page Interfaces
  - [ ] 3.1 Landing/Homepage
    - [x] Hero banner with featured movie + actions
    - [x] Navbar with search + auth buttons/avatar
    - [x] Movie rows (Trending, Top Rated, Action, Comedies, Recently Added)
    - [x] Footer links/social icons
  - [x] 3.2 Authentication pages
    - [x] Login form + forgot password link
    - [x] Register form + terms checkbox
    - [x] Profile page + logout + watchlist preview
  - [ ] 3.3 Browse/Search results page
    - [x] Sticky search bar with filters (genre/year/rating)
    - [x] Grid movie cards
    - [x] Pagination or infinite scroll

  - [ ] 3.4 Movie details page
    - [x] Backdrop + poster + title/tagline/release/runtime/genres/ratings
    - [x] Synopsis
    - [x] Cast horizontal list (TMDB)
    - [x] Trailer embed (YouTube)
    - [x] Similar movies row
    - [x] Add to watchlist + share actions
  - [ ] 3.5 Watch/Streaming page
    - [x] Video player UI (dummy/public domain)
    - [x] Video info + next episode button (if series)
    - [x] Optional comments section
  - [ ] 3.6 Admin dashboard (optional)
    - [x] Sidebar navigation
    - [x] Movie upload form
    - [x] Movie list table with edit/delete
  - [x] 3.7 Watchlist page
    - [x] Saved movies grid
    - [x] Remove-from-watchlist button
    - [x] Empty state

- [ ] 4. Backend Development (Node.js + Express)
  - [x] 4.1 Initialize npm + install packages (express, mongoose, dotenv, cors, jsonwebtoken, bcryptjs, axios)

  - [x] 4.2 Connect to MongoDB (local/Atlas)

  - [x] 4.3 Create User model (username, email, hashed password, watchlist array)

  - [x] 4.4 Create Movie model (metadata + video URL)
  - [x] 4.5 Auth routes (register/login/profile protected)

  - [x] 4.6 Movie routes (list/search/by id/trending)

  - [x] 4.7 Watchlist routes (add/remove/list protected)
  - [x] 4.8 Optional admin middleware + movie upload route
  - [x] 4.9 Integrate TMDB API for movie metadata (avoid full copyrighted seeding)
  - [ ] 4.10 Validation & error handling middleware

- [ ] 5. Frontend Development (React)
  - [ ] 5.1 Create React app with Vite or CRA
  - [x] 5.2 Setup React Router (/, /login, /register, /profile, /movies/:id, /watch/:id, /watchlist, /admin)

  - [ ] 5.3 API service module (axios instance + JWT interceptors)
  - [x] 5.4 Reusable components (Navbar, MovieCard, MovieRow, Loader/Spinner, ProtectedRoute)

- [x] 5.5 Pages (Home, Login, Register, MovieDetails, WatchPage, Watchlist, Search)

- [x] 5.6 State management (auth + watchlist)
- [x] 5.7 Debounced search functionality
  - [ ] 5.8 Pagination or infinite scroll
- [x] 5.9 Watchlist add/remove with optimistic UI
  - [x] 5.10 Tailwind CSS styling (responsive + dark mode toggle)
- [x] 5.11 Toast notifications (react-hot-toast)

- [ ] 6. Integration & Testing
  - [x] 6.1 Connect frontend to backend APIs (CORS)
- [x] 6.2 Test user flows end-to-end

  - [ ] 6.3 Handle loading states & error boundaries
  - [ ] 6.4 Basic tests (Jest + React Testing Library)
  - [ ] 6.5 Responsive testing (multi screen sizes)
  - [ ] 6.6 Lighthouse audit (performance improvements)

- [ ] 7. Deployment
  - [ ] 7.1 Prepare env vars (MongoDB URI, JWT secret, TMDB key)
  - [ ] 7.2 Build frontend (web)
  - [ ] 7.3 Deploy backend (Render/Railway/Fly/VPS)
  - [ ] 7.4 Deploy frontend (Vercel/Netlify)
  - [ ] 7.5 Optional custom domain + SSL
  - [ ] 7.6 CI/CD (GitHub Actions auto deploy on main)

- [ ] 8. Future Enhancements (Post-MVP)
  - [ ] 8.1 Ratings & reviews
  - [ ] 8.2 Subscription / Premium tiers (Stripe)
  - [ ] 8.3 Continue watching feature
  - [ ] 8.4 Multi-language support
  - [ ] 8.5 Upload user avatars
  - [ ] 8.6 Email verification + password reset
  - [ ] 8.7 Social login (Google/GitHub)
- [ ] 8.8 PWA offline browsing



