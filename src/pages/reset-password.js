import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { authService } from '../services/auth.service';
import { FaBrain, FaSpinner, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) { toast.error('Invalid reset link'); return; }
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const result = await authService.resetPassword(token, password);
      if (result.success) setSuccess(true);
      else toast.error(result.error || 'Reset failed');
    } catch (err) { toast.error(err.message); }
    setLoading(false);
  };

  return (
    <>
      <Head><title>Reset Password — BrainWave AI</title></Head>
      <div className="min-h-screen bg-dark-900 grid-pattern flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center">
                <FaBrain className="text-white" size={18} />
              </div>
              <span className="font-display font-bold text-xl"><span className="gradient-text">BrainWave</span><span className="text-white"> AI</span></span>
            </Link>
          </div>

          {success ? (
            <div className="card border border-emerald-500/20 text-center">
              <FaCheckCircle className="text-emerald-400 mx-auto mb-3" size={48} />
              <h2 className="text-xl font-bold text-white mb-2">Password Reset!</h2>
              <p className="text-slate-400 mb-4">Your password has been reset successfully. You can now login with your new password.</p>
              <Link href="/login" className="btn-primary w-full justify-center">Go to Login</Link>
            </div>
          ) : (
            <div className="card border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">Set New Password</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">New Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters" className="input-field pr-12" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label">Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password" className="input-field" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                  {loading ? <><FaSpinner className="animate-spin" /> Resetting...</> : 'Reset Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
