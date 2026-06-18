import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ChatInterface from '../../components/ai/ChatInterface';
import { aiService } from '../../services/ai.service';
import { FaFlask, FaBookOpen, FaCogs, FaQuoteRight, FaPlus, FaSpinner } from 'react-icons/fa';
import { CITATION_FORMATS, ACADEMIC_LEVELS } from '../../utils/constants';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'chat', label: 'AI Research Chat', icon: FaFlask },
  { id: 'citation', label: 'Citation Generator', icon: FaQuoteRight },
];

export default function ResearchAssistant() {
  const [tab, setTab] = useState('chat');
  const [citationSource, setCitationSource] = useState('');
  const [citationFormat, setCitationFormat] = useState('APA');
  const [citationResult, setCitationResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generateCitation = async () => {
    if (!citationSource.trim()) { toast.error('Please enter source information'); return; }
    setLoading(true);
    try {
      const result = await aiService.generateCitation(citationSource, citationFormat);
      if (result.success) setCitationResult(result.citation);
      else toast.error(result.error || 'Citation generation failed');
    } catch (err) { toast.error(err.message); }
    setLoading(false);
  };

  return (
    <DashboardLayout title="Research Assistant">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Research Assistant</h1>
        <p className="text-slate-400 text-sm mt-1">Get help with proposals, literature reviews, methodology, and citations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/5 pb-0">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 ${tab === t.id ? 'border-primary-500 text-primary-300 bg-primary-500/10' : 'border-transparent text-slate-400 hover:text-white'}`}>
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'chat' && (
        <ChatInterface
          placeholder="Ask about research methodology, request a literature review, get help with a proposal, or discuss any research topic..."
          systemContext="You are an expert academic research assistant. Help with research proposals, literature reviews, methodology, data analysis, and academic writing at all levels."
        />
      )}

      {tab === 'citation' && (
        <div className="max-w-2xl">
          <div className="card mb-4">
            <h3 className="font-semibold text-white mb-4">Generate Academic Citation</h3>
            <div className="mb-4">
              <label className="label">Citation Format</label>
              <div className="flex flex-wrap gap-2">
                {CITATION_FORMATS.map(f => (
                  <button key={f} onClick={() => setCitationFormat(f)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${citationFormat === f ? 'bg-primary-600 text-white' : 'bg-dark-800 border border-white/10 text-slate-400 hover:border-primary-500/40'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="label">Source Information</label>
              <textarea value={citationSource} onChange={e => setCitationSource(e.target.value)}
                rows={5} placeholder="Paste any source info: URL, book details (title, author, year, publisher), journal article info, etc."
                className="input-field resize-none" />
            </div>
            <button onClick={generateCitation} disabled={loading} className="btn-primary">
              {loading ? <><FaSpinner className="animate-spin" /> Generating...</> : <><FaQuoteRight size={14} /> Generate Citation</>}
            </button>
          </div>

          {citationResult && (
            <div className="card border-primary-500/20">
              <h4 className="font-semibold text-white mb-3">{citationFormat} Citation</h4>
              <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono bg-dark-800 rounded-xl p-4">{citationResult}</pre>
              <button onClick={() => { navigator.clipboard.writeText(citationResult); toast.success('Copied!'); }}
                className="btn-secondary text-sm mt-3">Copy Citation</button>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
