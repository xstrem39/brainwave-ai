import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { aiService } from '../../services/ai.service';
import { FaTools, FaSpinner, FaCopy, FaLayerGroup, FaListUl, FaBolt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const tools = [
  { id: 'summarize', label: 'Summarize Notes', icon: '📋', desc: 'Convert long notes into concise summaries' },
  { id: 'flashcards', label: 'Flashcards', icon: '🃏', desc: 'Generate study flashcards from your notes' },
  { id: 'quiz', label: 'Generate Quiz', icon: '❓', desc: 'Create practice questions from content' },
  { id: 'studyguide', label: 'Study Guide', icon: '📖', desc: 'Transform notes into structured study guides' },
  { id: 'explain', label: 'Explain Simply', icon: '💡', desc: 'Get simple explanations of complex topics' },
  { id: 'mindmap', label: 'Mind Map Outline', icon: '🗺️', desc: 'Create mind map outlines for topics' },
];

export default function StudyTools() {
  const [selectedTool, setSelectedTool] = useState('summarize');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const process = async () => {
    if (!input.trim()) { toast.error('Please enter your text or topic'); return; }
    setLoading(true);
    setResult('');
    try {
      const prompts = {
        summarize: `Summarize the following notes concisely, keeping all key points:\n\n${input}`,
        flashcards: `Create 10 study flashcards from the following content. Format each as:\nQ: [Question]\nA: [Answer]\n\nContent:\n${input}`,
        quiz: `Generate 10 practice quiz questions (multiple choice) from:\n\n${input}\n\nFormat: Q1. Question\nA) Option\nB) Option\nC) Option\nD) Option\nAnswer: X`,
        studyguide: `Convert the following into a comprehensive study guide with headings, key points, definitions, and review questions:\n\n${input}`,
        explain: `Explain the following topic in simple, easy-to-understand language for a student:\n\n${input}`,
        mindmap: `Create a hierarchical mind map outline for the topic:\n\n${input}\n\nUse indentation to show hierarchy.`,
      };

      const res = await aiService.chat(prompts[selectedTool] || prompts.summarize);
      if (res.success) setResult(res.content);
      else toast.error(res.error || 'Processing failed');
    } catch (err) { toast.error(err.message); }
    setLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(result); toast.success('Copied!'); };

  return (
    <DashboardLayout title="Study Tools">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Study Tools</h1>
        <p className="text-slate-400 text-sm mt-1">Transform your notes into powerful study materials</p>
      </div>

      {/* Tool selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {tools.map(t => (
          <button key={t.id} onClick={() => { setSelectedTool(t.id); setResult(''); }}
            className={`card py-3 text-center cursor-pointer transition-all hover:scale-[1.02] ${selectedTool === t.id ? 'border-primary-500 bg-primary-500/10' : 'border-white/5 hover:border-primary-500/30'}`}>
            <div className="text-2xl mb-1">{t.icon}</div>
            <p className="text-xs font-medium text-white">{t.label}</p>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <label className="label">{selectedTool === 'explain' || selectedTool === 'mindmap' ? 'Topic or Concept' : 'Your Notes / Content'}</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            rows={12} className="input-field resize-none mb-4"
            placeholder={selectedTool === 'explain' ? 'Enter the topic you want explained simply...' : selectedTool === 'mindmap' ? 'Enter a topic for the mind map...' : 'Paste your notes, textbook content, or any text...'} />
          <button onClick={process} disabled={loading || !input.trim()} className="btn-primary w-full justify-center">
            {loading ? <><FaSpinner className="animate-spin" /> Processing...</> : <><FaBolt size={14} /> Generate {tools.find(t => t.id === selectedTool)?.label}</>}
          </button>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">{tools.find(t => t.id === selectedTool)?.label}</h3>
            {result && <button onClick={copy} className="btn-ghost text-sm py-1"><FaCopy size={12} /> Copy</button>}
          </div>
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <FaSpinner className="text-primary-400 animate-spin" size={32} />
              <p className="text-slate-400 text-sm mt-3">Processing your content...</p>
            </div>
          )}
          {result && !loading && (
            <div className="prose-custom overflow-y-auto max-h-[500px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
            </div>
          )}
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-sm text-center">
              <FaLayerGroup size={32} className="mb-3 opacity-30" />
              <p>Enter your content and click Generate to see results here</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
