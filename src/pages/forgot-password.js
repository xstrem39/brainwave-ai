import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { authService } from '../services/auth.service';
import { validateEmail } from '../utils/validators';
import { FaBrain, FaSpinner, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) { toast.error('Please enter a valid email'); return; }
    setLoading(true);
    try {
      const result = await authService.forgotPassword(email);
      if (result.success) setSent(true);
      else toast.error(result.error || 'Request failed');
    } catch (err) { toast.error(err.message); }
    setLoading(false);
  };

  return (
    <>
      <Head><title>Forgot Password — BrainWave AI</title></Head>
      <div className="min-h-screen bg-dark-900 grid-pattern flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center">
                <FaBrain className="text-white" size={18} />
              </div>
              <span className="font-display font-bold text-xl"><span className="gradient-text">BrainWave</span><span className="text-white"> AI</span></span>
            </Link>
            {!sent ? (
              <>
                <h1 className="text-2xl font-bold text-white">Forgot your password?</h1>
                <p className="text-slate-400 text-sm mt-1">Enter your email and we'll send a reset link</p>
              </>
            ) : null}
          </div>

          {sent ? (
            <div className="card border border-emerald-500/20 text-center">
              <FaCheckCircle className="text-emerald-400 mx-auto mb-3" size={48} />
              <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
              <p className="text-slate-400 mb-4">If an account exists for <strong className="text-white">{email}</strong>, you'll receive a password reset link shortly.</p>
              <Link href="/login" className="btn-primary w-full justify-center">Back to Login</Link>
            </div>
          ) : (
            <div className="card border border-white/10">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com" className="input-field pl-10" autoFocus />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                  {loading ? <><FaSpinner className="animate-spin" /> Sending...</> : 'Send Reset Link'}
                </button>
              </form>
              <p className="text-center text-sm text-slate-400 mt-4">
                Remember your password? <Link href="/login" className="text-primary-400 hover:text-primary-300">Sign in</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
