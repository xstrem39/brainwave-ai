import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ChatInterface from '../../components/ai/ChatInterface';
import { FaPen, FaFileAlt, FaBook, FaCheckCircle, FaMagic } from 'react-icons/fa';

const writingTypes = [
  { id: 'essay', label: 'Essay Writing', icon: '📝', prompt: 'Help me write an academic essay about: ' },
  { id: 'report', label: 'Report Writing', icon: '📊', prompt: 'Help me write a professional report on: ' },
  { id: 'thesis', label: 'Thesis/Dissertation', icon: '🎓', prompt: 'Help me write a thesis chapter about: ' },
  { id: 'project', label: 'Project Work', icon: '📚', prompt: 'Help me write my final year project on: ' },
  { id: 'grammar', label: 'Grammar Check', icon: '✏️', prompt: 'Please check and correct the grammar of: ' },
  { id: 'paraphrase', label: 'Paraphrase', icon: '🔄', prompt: 'Please paraphrase this text academically: ' },
  { id: 'summarize', label: 'Summarize', icon: '📋', prompt: 'Please summarize this text concisely: ' },
  { id: 'improve', label: 'Improve Writing', icon: '⚡', prompt: 'Please improve and enhance this writing: ' },
];

export default function WritingAssistant() {
  const [selectedType, setSelectedType] = useState(null);
  const [systemContext, setSystemContext] = useState('');

  const selectType = (wt) => {
    setSelectedType(wt);
    setSystemContext(`You are an expert academic writing assistant specializing in ${wt.label}. Help the user write high-quality, well-structured academic content.`);
  };

  return (
    <DashboardLayout title="Writing Assistant">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Writing Assistant</h1>
        <p className="text-slate-400 text-sm mt-1">AI-powered writing for essays, reports, thesis, grammar correction, and paraphrasing</p>
      </div>

      {/* Writing type selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {writingTypes.map(wt => (
          <button key={wt.id} onClick={() => selectType(wt)}
            className={`card py-3 text-center cursor-pointer transition-all hover:scale-[1.02] ${selectedType?.id === wt.id ? 'border-primary-500 bg-primary-500/10' : 'border-white/5 hover:border-primary-500/30'}`}>
            <div className="text-2xl mb-1">{wt.icon}</div>
            <p className="text-xs font-medium text-white">{wt.label}</p>
          </button>
        ))}
      </div>

      {selectedType && (
        <div className="mb-4 flex items-center gap-2 text-sm text-primary-300">
          <FaCheckCircle size={14} /> Selected: <strong>{selectedType.label}</strong>
          <button onClick={() => setSelectedType(null)} className="text-slate-500 hover:text-white ml-2">× Clear</button>
        </div>
      )}

      <ChatInterface
        placeholder={selectedType?.prompt || 'Describe what you want to write... or paste your text for grammar checking, paraphrasing, or improvement.'}
        systemContext={systemContext || 'You are an expert academic writing assistant. Help with essays, reports, thesis writing, grammar correction, and paraphrasing.'}
      />
    </DashboardLayout>
  );
}
