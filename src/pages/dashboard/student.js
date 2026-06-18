import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import FeatureCard from '../../components/features/FeatureCard';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/user.service';
import {
  FaCoins, FaRobot, FaBook, FaTrophy, FaFlask, FaImage,
  FaClipboard, FaPen, FaTools, FaPalette, FaDesktop, FaFileAlt, FaCheckCircle,
} from 'react-icons/fa';
import Link from 'next/link';
import { formatRelativeTime, getDaysRemaining } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

export default function StudentDashboard() {
  const { user, credits, subscription } = useAuth();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          userService.getStats(),
          userService.getActivity(),
        ]);
        if (statsRes.success) setStats(statsRes.stats);
        if (activityRes.success) setActivity(activityRes.activities || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const quickAccess = [
    { title: 'Academic Assistant', desc: 'Ask any academic question', icon: FaRobot, href: ROUTES.academicAssistant, color: 'primary' },
    { title: 'Assignment Help', desc: 'Generate & solve assignments', icon: FaBook, href: ROUTES.assignmentAssistant, color: 'purple' },
    { title: 'Research Assistant', desc: 'Proposals, reviews & citations', icon: FaFlask, href: ROUTES.researchAssistant, color: 'cyan' },
    { title: 'Exam Prep', desc: 'Practice & mock tests', icon: FaClipboard, href: ROUTES.examPrep, color: 'green' },
    { title: 'Study Tools', desc: 'Summaries, flashcards & quizzes', icon: FaTools, href: ROUTES.studyTools, color: 'orange' },
    { title: 'Writing Assistant', desc: 'Essays, reports & editing', icon: FaPen, href: ROUTES.writingAssistant, color: 'pink' },
    { title: 'Image Generator', desc: 'Diagrams & illustrations', icon: FaImage, href: ROUTES.imageGenerator, color: 'amber', credits: 10 },
    { title: 'Flyer Creator', desc: 'Design stunning flyers', icon: FaPalette, href: ROUTES.flyerGenerator, color: 'primary', credits: 15 },
    { title: 'Presentations', desc: 'PowerPoint & defense slides', icon: FaDesktop, href: ROUTES.presentationGenerator, color: 'cyan', credits: 20 },
    { title: 'Past Questions', desc: 'Upload & solve past papers', icon: FaFileAlt, href: ROUTES.pastQuestions, color: 'green' },
  ];

  const daysLeft = subscription ? getDaysRemaining(subscription.endDate) : 0;

  return (
    <DashboardLayout title="Student Dashboard">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
          <span className="gradient-text">{user?.name?.split(' ')[0]}!</span> 👋
        </h1>
        <p className="text-slate-400 mt-1">What would you like to learn today?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Credits" value={credits || 0} icon={FaCoins} iconBg="bg-amber-500/20" loading={loading} />
        <StatsCard title="Quiz Attempts" value={stats?.quizAttempts || 0} icon={FaTrophy} iconBg="bg-emerald-500/20" loading={loading} />
        <StatsCard title="Research Projects" value={stats?.researchProjects || 0} icon={FaFlask} iconBg="bg-cyan-500/20" loading={loading} />
        <StatsCard title="Images Generated" value={stats?.imagesGenerated || 0} icon={FaImage} iconBg="bg-purple-500/20" loading={loading} />
      </div>

      {/* Subscription notice */}
      {!subscription && (
        <div className="mb-8 p-4 bg-gradient-to-r from-primary-600/20 to-purple-600/20 border border-primary-500/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-white">🚀 Upgrade to Pro for full access</p>
            <p className="text-sm text-slate-400 mt-0.5">Get 500+ credits, unlimited AI chat, image generation & more from GHS 200/month</p>
          </div>
          <Link href="/subscription/plans" className="btn-primary whitespace-nowrap text-sm">View Plans</Link>
        </div>
      )}

      {subscription && daysLeft <= 7 && (
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between gap-4">
          <p className="text-sm text-amber-300">⏰ Your subscription expires in <strong>{daysLeft}</strong> days</p>
          <Link href="/subscription/plans" className="text-sm text-amber-400 font-medium hover:underline">Renew Now</Link>
        </div>
      )}

      {/* Quick access grid */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickAccess.map(f => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>

      {/* Recent activity */}
      {activity.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="card space-y-3">
            {activity.slice(0, 8).map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                  <FaCheckCircle className="text-primary-400" size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 truncate">{a.description}</p>
                  <p className="text-xs text-slate-500">{formatRelativeTime(a.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
