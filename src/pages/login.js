import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validators';
import { FaBrain, FaEye, FaEyeSlash, FaSpinner, FaGoogle } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const redirect = router.query.redirect || '';

  useEffect(() => {
    if (isAuthenticated && user) {
      const dest = redirect || getDashboardByRole(user.role);
      router.replace(dest);
    }
  }, [isAuthenticated, user]);

  const getDashboardByRole = (role) => {
    const map = { admin: '/dashboard/admin', superadmin: '/dashboard/superadmin', teacher: '/dashboard/teacher', lecturer: '/dashboard/teacher' };
    return map[role] || '/dashboard/student';
  };

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!validateEmail(email)) errs.email = 'Invalid email address';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await login(email.trim().toLowerCase(), password);
      if (result.success) {
        toast.success(`Welcome back, ${result.user?.name?.split(' ')[0]}!`);
        router.push(redirect || getDashboardByRole(result.user?.role));
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Sign In — BrainWave AI</title></Head>
      <div className="min-h-screen bg-dark-900 grid-pattern flex items-center justify-center p-4">
        {/* Background glows */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center shadow-glow">
                <FaBrain className="text-white" size={22} />
              </div>
              <span className="font-display font-bold text-2xl">
                <span className="gradient-text">BrainWave</span>
                <span className="text-white"> AI</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back!</h1>
            <p className="text-slate-400 text-sm">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <div className="card border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                  placeholder="you@example.com"
                  className={`input-field ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                  autoComplete="email"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Password</label>
                  <Link href="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                    placeholder="Your password"
                    className={`input-field pr-12 ${errors.password ? 'border-red-500' : ''}`}
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
                {loading ? <><FaSpinner className="animate-spin" /> Signing in...</> : 'Sign In'}
              </button>
            </form>

            <div className="flex items-center gap-4 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-500">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button className="btn-secondary w-full justify-center py-3" onClick={() => toast('Google sign-in coming soon!')}>
              <FaGoogle size={16} className="text-red-400" /> Continue with Google
            </button>

            <p className="text-center text-sm text-slate-400 mt-5">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary-400 hover:text-primary-300 font-medium">Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
