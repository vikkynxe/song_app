import React, { useState, useEffect } from 'react';
import { Disc3, User, Mail, Lock, Calendar, FileText, Upload, ArrowRight, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { API_ENDPOINTS, fetchCsrfToken } from '../config/api';
import '../Style/log_in.css';

export const CreateAccount: React.FC = () => {
  const { navigate } = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [aboutYou, setAboutYou] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial CSRF token
    fetchCsrfToken().then((token) => {
      if (token) setCsrfToken(token);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Frontend validations
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please ensure both passwords match.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', username.trim());
      formData.append('email', email.trim());
      formData.append('password', password);
      formData.append('dob', dob);
      formData.append('about_you', aboutYou.trim());
      if (file) {
        formData.append('file', file);
      }
      if (csrfToken) {
        formData.append('csrf_token', csrfToken);
      }

      const headers: Record<string, string> = {};
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }

      const response = await fetch(API_ENDPOINTS.createUsers, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        const msg =
          (data && (data.message || data.error || data.detail)) ||
          'Failed to create account. Please check your information.';
        setError(msg);
      }
    } catch (err: any) {
      console.error('Create account error:', err);
      setError(
        'Cannot connect to backend at http://localhost:8000. Please ensure the backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container py-12 px-4">
      {/* Ambient background glows */}
      <div className="auth-ambient-orb auth-orb-primary" />
      <div className="auth-ambient-orb auth-orb-secondary" />

      <div className="w-full max-w-xl relative z-10">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Disc3 className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold font-['Syne'] text-white">Aura</span>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold font-['Syne'] text-white">
              Create an Account
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Join the platform to build, upload, and stream your custom playlists
            </p>
          </div>

          {/* Feedback banners */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{success}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Username */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="signup-username">
                  Username *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="signup-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                    className="w-full glass-input text-slate-100 placeholder:text-slate-500 text-xs sm:text-sm rounded-xl py-2.5 pl-9 pr-3"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="signup-email">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full glass-input text-slate-100 placeholder:text-slate-500 text-xs sm:text-sm rounded-xl py-2.5 pl-9 pr-3"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="signup-pass">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="signup-pass"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full glass-input text-slate-100 placeholder:text-slate-500 text-xs sm:text-sm rounded-xl py-2.5 pl-9 pr-3"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="signup-cpass">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="signup-cpass"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full glass-input text-slate-100 placeholder:text-slate-500 text-xs sm:text-sm rounded-xl py-2.5 pl-9 pr-3"
                  />
                </div>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="signup-dob">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="signup-dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full glass-input text-slate-100 placeholder:text-slate-500 text-xs sm:text-sm rounded-xl py-2.5 pl-9 pr-3 scheme-dark"
                />
              </div>
            </div>

            {/* About You */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="signup-about">
                About You
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <textarea
                  id="signup-about"
                  rows={2}
                  value={aboutYou}
                  onChange={(e) => setAboutYou(e.target.value)}
                  placeholder="Share a short bio or musical preferences..."
                  className="w-full glass-input text-slate-100 placeholder:text-slate-500 text-xs sm:text-sm rounded-xl py-2.5 pl-9 pr-3 resize-none"
                />
              </div>
            </div>

            {/* Profile Picture Upload */}
            <div>
              <span className="block text-xs font-medium text-slate-300 mb-1">
                Profile Photo (Optional)
              </span>
              <label
                htmlFor="signup-file"
                className="flex items-center justify-between p-3 rounded-xl border border-dashed border-white/10 hover:border-indigo-400/40 bg-white/[0.02] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Upload className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-xs text-slate-300 truncate">
                    {file ? file.name : 'Choose an image file'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 shrink-0 ml-2">Browse</span>
                <input
                  id="signup-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 px-4 glass-btn-primary text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link to login */}
          <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
