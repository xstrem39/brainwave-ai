import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

export default function DashboardIndex() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/login'); return; }
    const map = {
      admin: '/dashboard/admin',
      superadmin: '/dashboard/superadmin',
      teacher: '/dashboard/teacher',
      lecturer: '/dashboard/teacher',
    };
    router.replace(map[user.role] || '/dashboard/student');
  }, [user, loading]);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-slate-400 text-sm">Redirecting...</div>
    </div>
  );
}
