import DashboardLayout from '../../components/layout/DashboardLayout';
import ChatInterface from '../../components/ai/ChatInterface';
import { SUBJECTS } from '../../utils/constants';
import { useState } from 'react';
import { FaAtom, FaCalculator, FaCode, FaFlask, FaBookOpen, FaGlobeAfrica } from 'react-icons/fa';

const quickPrompts = [
  { icon: FaCalculator, label: 'Solve Math', prompt: 'Solve this step by step: ' },
  { icon: FaAtom, label: 'Physics', prompt: 'Explain this physics concept: ' },
  { icon: FaFlask, label: 'Chemistry', prompt: 'Help me understand this chemistry problem: ' },
  { icon: FaCode, label: 'Programming', prompt: 'Help me with this coding problem: ' },
  { icon: FaBookOpen, label: 'Essay Help', prompt: 'Help me write an essay about: ' },
  { icon: FaGlobeAfrica, label: 'History/Geo', prompt: 'Explain this historical event: ' },
];

export default function AcademicAssistant() {
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('');

  return (
    <DashboardLayout title="Academic Assistant">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Academic Assistant</h1>
          <p className="text-slate-400 text-sm mt-1">Ask any academic question — math, science, languages, and more</p>
        </div>
        <div className="flex gap-3">
          <select value={subject} onChange={e => setSubject(e.target.value)}
            className="bg-dark-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary-500">
            <option value="">All Subjects</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={level} onChange={e => setLevel(e.target.value)}
            className="bg-dark-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary-500">
            <option value="">All Levels</option>
            {['Basic School', 'Secondary', 'College', 'Undergraduate', 'Masters', 'PhD'].map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick prompt buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {quickPrompts.map(({ icon: Icon, label }) => (
          <button key={label}
            className="flex items-center gap-2 px-3 py-1.5 bg-dark-800 border border-white/10 rounded-lg text-sm text-slate-400 hover:border-primary-500/40 hover:text-primary-300 transition-all">
            <Icon size={12} /> {label}
          </button>
        ))}
      </div>

      <ChatInterface
        title=""
        placeholder="Ask any academic question: solve equations, explain concepts, write essays, or get step-by-step solutions..."
        subject={subject}
        level={level}
        systemContext={subject ? `You are helping with ${subject}${level ? ` at ${level} level` : ''}.` : ''}
      />
    </DashboardLayout>
  );
}
