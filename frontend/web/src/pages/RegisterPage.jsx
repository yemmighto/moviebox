import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register } from '../api/auth';
import { useAuth } from '../auth/AuthContext.jsx';

export default function RegisterPage() {
  const nav = useNavigate();
  const { signIn } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);


  async function onSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (!agree) {
      toast.error('Please accept the terms');
      return;
    }

    setSubmitting(true);
    try {
      const data = await register({ username, email, password });
      signIn(data.token, data.user);
      toast.success('Account created');
      nav('/profile');
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        data?.message ||
        (Array.isArray(data?.errors) ? data.errors.map((e) => e.msg).join(', ') : null) ||
        (typeof data === 'string' ? data : null) ||
        err?.message ||
        'Register failed';

      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-2">Register</h2>
      <form className="card card-body bg-base-100" onSubmit={onSubmit}>
        <label className="form-control">
          <span className="label-text">Name</span>
          <input
            className="input input-bordered"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label className="form-control mt-3">
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

        <label className="form-control mt-3">
          <span className="label-text">Confirm Password</span>
          <div className="relative">
            <input
              className="input input-bordered w-full pr-10"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              type={showConfirmPassword ? 'text' : 'password'}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm opacity-70 hover:opacity-100"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>


        <label className="label cursor-pointer mt-3">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span className="label-text ml-2">I agree to the Terms</span>
        </label>

        <button className="btn btn-primary mt-4" disabled={submitting} type="submit">
          {submitting ? 'Creating...' : 'Create account'}
        </button>
        <div className="mt-3 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="link link-primary">Login</Link>
        </div>
      </form>
    </div>
  );
}

