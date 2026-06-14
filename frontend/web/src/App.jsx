import React, { useEffect, useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import MovieDetailsPage from './pages/MovieDetailsPage.jsx';
import WatchPage from './pages/WatchPage.jsx';
import WatchlistPage from './pages/WatchlistPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return useMemo(() => ({ theme, setTheme }), [theme]);
}

function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="navbar bg-base-100 border-b px-4">
      <div className="flex-1">
        <Link to="/" className="font-bold text-lg">
          MovieBox
        </Link>
      </div>

      <div className="flex-none gap-2 items-center">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {theme === 'dark' ? '👁️' : '🙈'}
        </button>

        {!user ? (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="btn btn-ghost btn-sm">
              Profile
            </Link>
            <Link to="/admin" className="btn btn-ghost btn-sm">
              Admin
            </Link>
            <button className="btn btn-sm" onClick={signOut}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-white text-neutral dark:bg-base-200 dark:text-base-content">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/movies/:id" element={<MovieDetailsPage />} />
          <Route path="/watch/:id" element={<WatchPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/admin" element={<AdminPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

