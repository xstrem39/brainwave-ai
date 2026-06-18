import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validators';
import { FaBrain, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const roles = [
  { value: 'student', label: 'Student', emoji: '🎓' },
  { value: 'teacher', label: 'Teacher', emoji: '📚' },
  { value: 'lecturer', label: 'Lecturer', emoji: '🏛️' },
  { value: 'institution_admin', label: 'Institution Admin', emoji: '🏫' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard/student');
  }, [isAuthenticated]);

  const handleChange = (field, value) => {
    setForm(p => ({ ...p, [field]: value }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name?.trim() || form.name.trim().length < 2) errs.name = 'Please enter your full name (min 2 chars)';
    if (!validateEmail(form.email)) errs.email = 'Invalid email address';
    const pwdResult = validatePassword(form.password);
    if (!pwdResult.valid) errs.password = pwdResult.errors[0];
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await register(form);
      if (result.success) {
        toast.success('Account created successfully! Please log in.');
        router.push('/login');
      } else {
        toast.error(result.error || 'Registration failed');
        if (result.error?.includes('email')) setErrors({ email: result.error });
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Create Account — BrainWave AI</title></Head>
      <div className="min-h-screen bg-dark-900 grid-pattern flex items-center justify-center p-4 py-12">
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center shadow-glow">
                <FaBrain className="text-white" size={22} />
              </div>
              <span className="font-display font-bold text-2xl">
                <span className="gradient-text">BrainWave</span><span className="text-white"> AI</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Create your free account</h1>
            <p className="text-slate-400 text-sm">7-day free trial · 100 free credits · No card required</p>
          </div>

          <div className="card border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role selection */}
              <div>
                <label className="label">I am a...</label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map(r => (
                    <button key={r.value} type="button"
                      onClick={() => handleChange('role', r.value)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.role === r.value ? 'border-primary-500 bg-primary-600/20 text-primary-300' : 'border-white/10 bg-dark-800 text-slate-400 hover:border-white/20'}`}>
                      <span>{r.emoji}</span> {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Full Name</label>
                <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)}
                  placeholder="Kwame Asante" className={`input-field ${errors.name ? 'border-red-500' : ''}`} />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="label">Email Address</label>
                <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)}
                  placeholder="you@example.com" className={`input-field ${errors.email ? 'border-red-500' : ''}`} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={form.password}
                    onChange={e => handleChange('password', e.target.value)}
                    placeholder="Minimum 8 characters" className={`input-field pr-12 ${errors.password ? 'border-red-500' : ''}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="label">Confirm Password</label>
                <input type="password" value={form.confirmPassword}
                  onChange={e => handleChange('confirmPassword', e.target.value)}
                  placeholder="Repeat your password" className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`} />
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <p className="text-xs text-slate-500">
                By creating an account you agree to our{' '}
                <a href="#" className="text-primary-400 hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-primary-400 hover:underline">Privacy Policy</a>.
              </p>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
                {loading ? <><FaSpinner className="animate-spin" /> Creating account...</> : 'Create Free Account'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-5">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
