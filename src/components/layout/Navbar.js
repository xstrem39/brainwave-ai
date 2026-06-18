import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { FaBrain, FaBell, FaCoins, FaChevronDown, FaBars, FaTimes, FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { formatRelativeTime, getInitials, getAvatarColor } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function Navbar({ onMenuClick }) {
  const { user, credits, logout, isAuthenticated } = useAuth();
  const { notifications, unread, markRead, markAllRead } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  const getDashboardUrl = () => {
    if (!user) return '/dashboard';
    const roleMap = {
      admin: '/dashboard/admin',
      superadmin: '/dashboard/superadmin',
      teacher: '/dashboard/teacher',
      lecturer: '/dashboard/teacher',
    };
    return roleMap[user.role] || '/dashboard/student';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/5 bg-dark-900/90 backdrop-blur-xl">
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        {/* Left: Logo + mobile menu */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button onClick={onMenuClick} className="lg:hidden btn-ghost p-2 text-slate-400">
              <FaBars size={20} />
            </button>
          )}
          <Link href={isAuthenticated ? getDashboardUrl() : '/'} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all">
              <FaBrain className="text-white" size={18} />
            </div>
            <span className="font-display font-bold text-lg hidden sm:block">
              <span className="gradient-text">BrainWave</span>
              <span className="text-white"> AI</span>
            </span>
          </Link>
        </div>

        {/* Center nav links (public only) */}
        {!isAuthenticated && (
          <div className="hidden md:flex items-center gap-1">
            {[['Features', '/#features'], ['Pricing', '/subscription/plans'], ['About', '/#about']].map(([label, href]) => (
              <Link key={label} href={href} className="btn-ghost text-sm">{label}</Link>
            ))}
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* Credits */}
              <Link href="/subscription/plans" className="hidden sm:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-1.5 text-amber-400 text-sm font-medium hover:bg-amber-500/20 transition-all">
                <FaCoins size={13} />
                <span>{credits || 0}</span>
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                  className="relative btn-ghost p-2 text-slate-400">
                  <FaBell size={18} />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-12 w-80 card border border-white/10 shadow-2xl z-50 p-0 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                      <span className="font-semibold text-white">Notifications</span>
                      {unread > 0 && (
                        <button onClick={markAllRead} className="text-xs text-primary-400 hover:text-primary-300">Mark all read</button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-slate-500 text-sm">No notifications</div>
                      ) : (
                        notifications.slice(0, 10).map(n => (
                          <div key={n.id} onClick={() => markRead(n.id)}
                            className={`px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all ${!n.read ? 'bg-primary-600/5' : ''}`}>
                            <p className={`text-sm ${n.read ? 'text-slate-400' : 'text-white'}`}>{n.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{formatRelativeTime(n.createdAt)}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  className="flex items-center gap-2 btn-ghost p-1.5 rounded-xl">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: getAvatarColor(user?.name || '') }}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      getInitials(user?.name || 'U')
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-slate-300">{user?.name?.split(' ')[0]}</span>
                  <FaChevronDown size={12} className="text-slate-500" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-56 card border border-white/10 shadow-2xl z-50 p-2">
                    <div className="px-3 py-2 border-b border-white/5 mb-2">
                      <p className="font-medium text-white text-sm">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <Link href={getDashboardUrl()} onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg transition-all">
                      <FaUserCircle size={14} /> Dashboard
                    </Link>
                    <Link href="/settings/profile" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg transition-all">
                      <FaCog size={14} /> Settings
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-1">
                      <FaSignOutAlt size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-ghost text-sm">Sign In</Link>
              <Link href="/register" className="btn-primary text-sm px-4 py-2">Get Started Free</Link>
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close dropdowns */}
      {(notifOpen || profileOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setNotifOpen(false); setProfileOpen(false); }} />
      )}
    </nav>
  );
}
