import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import {
  FaHome, FaRobot, FaBook, FaFlask, FaFileAlt, FaClipboard,
  FaTools, FaPen, FaImage, FaPalette, FaDesktop,
  FaQuestionCircle, FaFileExcel, FaChartBar, FaUsers, FaCrown,
  FaCoins, FaTimes, FaGraduationCap,
} from 'react-icons/fa';

const studentNav = [
  { label: 'Dashboard', href: '/dashboard/student', icon: FaHome },
  { label: 'Academic Assistant', href: ROUTES.academicAssistant, icon: FaRobot },
  { label: 'Assignment Help', href: ROUTES.assignmentAssistant, icon: FaBook },
  { label: 'Research Assistant', href: ROUTES.researchAssistant, icon: FaFlask },
  { label: 'Past Questions', href: ROUTES.pastQuestions, icon: FaFileAlt },
  { label: 'Exam Prep', href: ROUTES.examPrep, icon: FaClipboard },
  { label: 'Study Tools', href: ROUTES.studyTools, icon: FaTools },
  { label: 'Writing Assistant', href: ROUTES.writingAssistant, icon: FaPen },
  { label: 'Image Generator', href: ROUTES.imageGenerator, icon: FaImage },
  { label: 'Flyer Generator', href: ROUTES.flyerGenerator, icon: FaPalette },
  { label: 'Presentations', href: ROUTES.presentationGenerator, icon: FaDesktop },
];

const teacherNav = [
  { label: 'Dashboard', href: '/dashboard/teacher', icon: FaHome },
  { label: 'Quiz Builder', href: ROUTES.quizBuilder, icon: FaQuestionCircle },
  { label: 'Exam Builder', href: ROUTES.examBuilder, icon: FaFileExcel },
  { label: 'Teaching Assistant', href: ROUTES.academicAssistant, icon: FaRobot },
  { label: 'Image Generator', href: ROUTES.imageGenerator, icon: FaImage },
  { label: 'Flyer Generator', href: ROUTES.flyerGenerator, icon: FaPalette },
  { label: 'Presentations', href: ROUTES.presentationGenerator, icon: FaDesktop },
];

const adminNav = [
  { label: 'Admin Dashboard', href: '/dashboard/admin', icon: FaChartBar },
  { label: 'Users', href: '/dashboard/admin', icon: FaUsers },
];

const superadminNav = [
  { label: 'SuperAdmin', href: '/dashboard/superadmin', icon: FaCrown },
  { label: 'All Admins', href: '/dashboard/superadmin', icon: FaUsers },
];

export default function Sidebar({ open, onClose }) {
  const { user, credits, subscription } = useAuth();
  const router = useRouter();

  const getNavItems = () => {
    if (!user) return studentNav;
    if (user.role === 'superadmin') return superadminNav;
    if (user.role === 'admin') return adminNav;
    if (['teacher', 'lecturer'].includes(user.role)) return teacherNav;
    return studentNav;
  };

  const navItems = getNavItems();

  const isActive = (href) => router.pathname === href || (href !== '/' && router.pathname.startsWith(href));

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 bottom-0 w-72 bg-dark-800 border-r border-white/5 z-40 flex flex-col transition-transform duration-300 overflow-hidden
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Mobile close */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/5">
          <span className="text-sm font-medium text-slate-400">Menu</span>
          <button onClick={onClose} className="btn-ghost p-1.5"><FaTimes size={16} /></button>
        </div>

        {/* User info */}
        {user && (
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role?.replace('_', ' ')}</p>
              </div>
            </div>

            {/* Credits + Subscription badges */}
            <div className="flex items-center gap-2 mt-3">
              <span className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1 text-amber-400 text-xs font-medium">
                <FaCoins size={10} /> {credits || 0} credits
              </span>
              {subscription ? (
                <span className="badge-success text-xs">{subscription.plan}</span>
              ) : (
                <Link href="/subscription/plans" className="badge-primary text-xs hover:opacity-80">Upgrade</Link>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href + item.label} href={item.href} onClick={onClose}
                className={active ? 'nav-link-active' : 'nav-link'}>
                <Icon size={16} className={active ? 'text-primary-400' : 'text-slate-500'} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Upgrade prompt */}
        {!subscription && user && (
          <div className="p-4 border-t border-white/5">
            <div className="bg-gradient-to-r from-primary-600/20 to-purple-600/20 border border-primary-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaGraduationCap className="text-primary-400" />
                <span className="text-sm font-semibold text-white">Upgrade to Pro</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">Get unlimited AI access, 500+ credits & all premium features</p>
              <Link href="/subscription/plans" className="btn-primary text-xs w-full justify-center">
                View Plans — From GHS 200/mo
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
