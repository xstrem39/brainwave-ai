import DashboardLayout from '../../components/layout/DashboardLayout';
import ChatInterface from '../../components/ai/ChatInterface';
import { useState } from 'react';
import { SUBJECTS } from '../../utils/constants';

export default function PastQuestions() {
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState('');

  return (
    <DashboardLayout title="Past Questions">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Past Questions</h1>
        <p className="text-slate-400 text-sm mt-1">Solve and understand past exam questions with detailed explanations</p>
      </div>
      <div className="flex flex-wrap gap-3 mb-5">
        <select value={subject} onChange={e => setSubject(e.target.value)}
          className="bg-dark-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary-500">
          <option value="">Select Subject</option>
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>
        <input value={year} onChange={e => setYear(e.target.value)} placeholder="Year (e.g. 2023)"
          className="bg-dark-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary-500 w-36" />
      </div>
      <ChatInterface
        placeholder={`Paste your past exam question here${subject ? ` (${subject}${year ? ', ' + year : ''})` : ''}... I'll solve it with full explanation.`}
        systemContext={`You are an expert at solving past exam questions${subject ? ` in ${subject}` : ''}. Provide step-by-step solutions with clear explanations of each step.`}
        subject={subject}
      />
    </DashboardLayout>
  );
}
