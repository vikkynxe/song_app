import React, { useState } from 'react';
import { Disc3, Lock, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { API_ENDPOINTS } from '../config/api';
import '../Style/log_in.css';

export const LogIn: React.FC = () => {
  const { navigate } = useRouter();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !password.trim()) {
      setError('Please provide both username and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.signIn, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: userName.trim(),
          password: password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data) {
        const token = data.token || data.hash || (data.data && data.data.token) || 'user-auth-token';
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', token);
        localStorage.setItem('username', userName.trim());
        navigate('/HomePage');
      } else {
        const errMsg =
          (data && (data.message || data.error || data.detail)) ||
          'Invalid username or password. Please try again.';
        setError(errMsg);
      }
    } catch (err: any) {
      console.error('Sign in request error:', err);
      setError(
        'Cannot connect to backend at http://localhost:8000. Please ensure your backend server is running and accessible.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container p-4">
      {/* Ambient background glows */}
      <div className="auth-ambient-orb auth-orb-primary" />
      <div className="auth-ambient-orb auth-orb-secondary" />

      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl">
          {/* Brand header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-indigo-500/25 mb-4 text-white">
              <Disc3 className="w-8 h-8 animate-[spin_12s_linear_infinite]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-['Syne'] tracking-tight text-white">
              Welcome to Aura
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Sign in to manage and stream your music library
            </p>
          </div>

          {/* Error notice */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="login-username">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-username"
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full glass-input text-slate-100 placeholder:text-slate-500 text-sm rounded-xl py-3 pl-10 pr-4"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input text-slate-100 placeholder:text-slate-500 text-sm rounded-xl py-3 pl-10 pr-4"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 glass-btn-primary text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link to create account */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/create_account')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
