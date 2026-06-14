import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getProfile } from '../api/auth';
import { setAuthToken } from '../api/http';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthToken(token);

    async function load() {
      try {
        if (!token) {
          setUser(null);
          return;
        }
        const data = await getProfile();
        setUser(data.user);
      } catch (e) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  const value = useMemo(() => {
    return {
      token,
      user,
      loading,
      signOut: () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        toast.success('Signed out');
      },
      signIn: (newToken, nextUser) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(nextUser);
      },
    };
  }, [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

