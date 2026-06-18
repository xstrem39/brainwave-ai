import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Head from 'next/head';
import { APP_NAME } from '../../utils/constants';

export default function DashboardLayout({ children, title, requiresSubscription = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, loading, isSubscribed } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/login?redirect=${router.pathname}`);
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!loading && isAuthenticated && requiresSubscription && !isSubscribed()) {
      router.push('/subscription/plans?upgrade=true');
    }
  }, [isAuthenticated, loading, requiresSubscription, isSubscribed]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center shadow-glow animate-pulse">
            <span className="text-2xl">🧠</span>
          </div>
          <div className="text-slate-400 text-sm">Loading BrainWave AI...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <Head>
        <title>{title ? `${title} — ${APP_NAME}` : APP_NAME}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-dark-900">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="lg:ml-72 pt-16 min-h-screen">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
