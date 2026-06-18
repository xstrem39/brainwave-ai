import DashboardLayout from '../../components/layout/DashboardLayout';
import ChatInterface from '../../components/ai/ChatInterface';
import { FaBook } from 'react-icons/fa';

const quickActions = [
  { label: '📝 Generate Assignment', prompt: 'Generate a complete assignment on: ' },
  { label: '🔍 Solve Assignment', prompt: 'Solve this assignment question step by step: ' },
  { label: '💡 Explain', prompt: 'Explain this assignment concept clearly: ' },
  { label: '✨ Improve', prompt: 'Improve this assignment answer: ' },
];

export default function AssignmentAssistant() {
  return (
    <DashboardLayout title="Assignment Assistant">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Assignment Assistant</h1>
        <p className="text-slate-400 text-sm mt-1">Generate, solve, explain, and improve your assignments with AI</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {quickActions.map(a => (
          <button key={a.label} className="px-3 py-1.5 bg-dark-800 border border-white/10 rounded-lg text-sm text-slate-400 hover:border-primary-500/40 hover:text-primary-300 transition-all">
            {a.label}
          </button>
        ))}
      </div>
      <ChatInterface
        placeholder="Paste your assignment question here... I can generate, solve, explain, or improve any assignment."
        systemContext="You are an expert academic assignment assistant. Help students generate, solve, explain, and improve assignments across all subjects and levels."
      />
    </DashboardLayout>
  );
}
