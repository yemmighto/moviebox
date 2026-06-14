import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../api/auth';
import { useAuth } from '../auth/AuthContext.jsx';

export default function LoginPage() {
  const nav = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await login({ email, password });
      signIn(data.token, data.user);
      toast.success('Logged in');
      nav('/profile');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-2">Login</h2>
      <form className="card card-body bg-base-100" onSubmit={onSubmit}>
        <label className="form-control">
          <span className="label-text">Email</span>
          <input
            className="input input-bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>
        <label className="form-control mt-3">
          <span className="label-text">Password</span>
          <div className="relative">
            <input
              className="input input-bordered w-full pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm opacity-70 hover:opacity-100"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        <div className="mt-3 text-right">

          <button
            type="button"
            className="link link-primary text-sm"
            onClick={() => toast('Forgot password: demo UI only', { icon: '🔒' })}
          >
            Forgot Password?
          </button>
        </div>

        <button className="btn btn-primary mt-2" disabled={submitting} type="submit">
          {submitting ? 'Logging in...' : 'Login'}
        </button>

        <div className="mt-3 text-sm">
          No account? <Link to="/register" className="link link-primary">Register</Link>
        </div>

      </form>
    </div>
  );
}

