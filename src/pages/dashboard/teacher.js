import DashboardLayout from '../../components/layout/DashboardLayout';
import FeatureCard from '../../components/features/FeatureCard';
import StatsCard from '../../components/dashboard/StatsCard';
import { useAuth } from '../../context/AuthContext';
import { FaQuestionCircle, FaFileExcel, FaRobot, FaImage, FaPalette, FaDesktop, FaUsers, FaClipboard, FaCoins, FaBook } from 'react-icons/fa';
import { ROUTES } from '../../utils/constants';

export default function TeacherDashboard() {
  const { user, credits } = useAuth();

  const tools = [
    { title: 'Quiz Builder', desc: 'Create AI-powered quizzes with auto-grading', icon: FaQuestionCircle, href: ROUTES.quizBuilder, color: 'primary' },
    { title: 'Exam Builder', desc: 'Build complete exams with marking schemes', icon: FaFileExcel, href: ROUTES.examBuilder, color: 'purple' },
    { title: 'AI Teaching Assistant', desc: 'Lesson plans, schemes of work, notes', icon: FaRobot, href: ROUTES.academicAssistant, color: 'cyan' },
    { title: 'Image Generator', desc: 'Teaching diagrams & visual aids', icon: FaImage, href: ROUTES.imageGenerator, color: 'orange', credits: 10 },
    { title: 'Flyer Creator', desc: 'School & event flyers', icon: FaPalette, href: ROUTES.flyerGenerator, color: 'pink', credits: 15 },
    { title: 'Presentations', desc: 'Teaching slides & lecture decks', icon: FaDesktop, href: ROUTES.presentationGenerator, color: 'green', credits: 20 },
  ];

  return (
    <DashboardLayout title="Teacher Dashboard">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome, <span className="gradient-text">{user?.name?.split(' ')[0]}!</span> 📚
        </h1>
        <p className="text-slate-400 mt-1">Your AI-powered teaching toolkit is ready.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Credits" value={credits || 0} icon={FaCoins} iconBg="bg-amber-500/20" />
        <StatsCard title="Active Quizzes" value="—" icon={FaQuestionCircle} iconBg="bg-primary-500/20" />
        <StatsCard title="Active Exams" value="—" icon={FaClipboard} iconBg="bg-purple-500/20" />
        <StatsCard title="Assignments" value="—" icon={FaBook} iconBg="bg-cyan-500/20" />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Teaching Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {tools.map(t => <FeatureCard key={t.title} {...t} />)}
        </div>
      </div>

      {/* Quick AI Prompt */}
      <div className="card border-primary-500/20">
        <h3 className="font-semibold text-white mb-3">Quick AI Helper</h3>
        <p className="text-sm text-slate-400 mb-4">Generate lesson plans, marking schemes, or any teaching resource instantly.</p>
        <a href={ROUTES.academicAssistant} className="btn-primary text-sm">Open AI Assistant</a>
      </div>
    </DashboardLayout>
  );
}
