import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { authService } from '../services/auth.service';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    const verify = async () => {
      try {
        const result = await authService.verifyEmail(token);
        if (result.success) { setStatus('success'); setMessage(result.message); }
        else { setStatus('error'); setMessage(result.error); }
      } catch (err) { setStatus('error'); setMessage(err.message); }
    };
    verify();
  }, [token]);

  return (
    <>
      <Head><title>Verify Email — BrainWave AI</title></Head>
      <div className="min-h-screen bg-dark-900 grid-pattern flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center border border-white/10">
          {status === 'loading' && (
            <>
              <FaSpinner className="text-primary-400 animate-spin mx-auto mb-4" size={48} />
              <h2 className="text-xl font-bold text-white">Verifying your email...</h2>
            </>
          )}
          {status === 'success' && (
            <>
              <FaCheckCircle className="text-emerald-400 mx-auto mb-4" size={64} />
              <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
              <p className="text-slate-400 mb-6">{message || 'Your email has been verified. You can now log in.'}</p>
              <Link href="/login" className="btn-primary w-full justify-center">Sign In Now</Link>
            </>
          )}
          {status === 'error' && (
            <>
              <FaTimesCircle className="text-red-400 mx-auto mb-4" size={64} />
              <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
              <p className="text-slate-400 mb-6">{message || 'The verification link is invalid or has expired.'}</p>
              <Link href="/register" className="btn-secondary w-full justify-center">Create New Account</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
