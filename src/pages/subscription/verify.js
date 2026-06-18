import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { paymentService } from '../../services/payment.service';
import { useAuth } from '../../context/AuthContext';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

export default function VerifyPayment() {
  const router = useRouter();
  const { ref } = router.query;
  const { loadUser } = useAuth();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!ref) return;
    const verify = async () => {
      try {
        const result = await paymentService.verifyPayment(ref);
        if (result.success) {
          setStatus('success');
          setMessage(result.message || 'Payment successful!');
          await loadUser();
        } else {
          setStatus('error');
          setMessage(result.error || 'Payment verification failed');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Verification failed');
      }
    };
    verify();
  }, [ref]);

  return (
    <>
      <Head><title>Payment Verification — BrainWave AI</title></Head>
      <div className="min-h-screen bg-dark-900 grid-pattern flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          {status === 'loading' && (
            <>
              <FaSpinner className="text-primary-400 animate-spin mx-auto mb-4" size={48} />
              <h2 className="text-xl font-bold text-white mb-2">Verifying Payment...</h2>
              <p className="text-slate-400">Please wait while we confirm your payment.</p>
            </>
          )}
          {status === 'success' && (
            <>
              <FaCheckCircle className="text-emerald-400 mx-auto mb-4" size={64} />
              <h2 className="text-2xl font-bold text-white mb-2">Payment Successful! 🎉</h2>
              <p className="text-slate-400 mb-6">{message}</p>
              <Link href="/dashboard/student" className="btn-primary w-full justify-center">Go to Dashboard</Link>
            </>
          )}
          {status === 'error' && (
            <>
              <FaTimesCircle className="text-red-400 mx-auto mb-4" size={64} />
              <h2 className="text-2xl font-bold text-white mb-2">Payment Issue</h2>
              <p className="text-slate-400 mb-6">{message}</p>
              <div className="flex gap-3">
                <Link href="/subscription/plans" className="btn-secondary flex-1 justify-center">Try Again</Link>
                <Link href="/dashboard" className="btn-primary flex-1 justify-center">Dashboard</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
