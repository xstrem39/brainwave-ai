import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { aiService } from '../../services/ai.service';
import { FaDesktop, FaSpinner, FaDownload, FaMagic } from 'react-icons/fa';
import { ACADEMIC_LEVELS } from '../../utils/constants';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function PresentationGenerator() {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('undergraduate');
  const [slideCount, setSlideCount] = useState(10);
  const [presentationType, setPresentationType] = useState('research');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const generate = async () => {
    if (!topic.trim()) { toast.error('Please enter a presentation topic'); return; }
    setLoading(true);
    setResult('');
    try {
      const prompt = `Create a complete ${slideCount}-slide ${presentationType} presentation on: "${topic}"

Level: ${level}

For each slide, provide:
## Slide [Number]: [Title]
**Content:**
- Key point 1
- Key point 2
- Key point 3

**Speaker Notes:** [What to say]

Include slides for: Title, Introduction, Overview, [Main content slides], Conclusion, Recommendations, Q&A/References

Make it professional, structured, and appropriate for ${level} level academic presentation.`;

      const res = await aiService.chat(prompt, { model: 'claude' });
      if (res.success) setResult(res.content);
      else toast.error(res.error || 'Generation failed');
    } catch (err) { toast.error(err.message); }
    setLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(result); toast.success('Presentation outline copied!'); };

  return (
    <DashboardLayout title="Presentation Generator">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Presentation Generator</h1>
        <p className="text-slate-400 text-sm mt-1">Generate complete slide-by-slide presentations for research, teaching, and more</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-white mb-4">Presentation Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Presentation Type</label>
              {['research', 'teaching', 'lecture', 'seminar', 'conference', 'defense'].map(t => (
                <button key={t} onClick={() => setPresentationType(t)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-all capitalize ${presentationType === t ? 'bg-primary-600/20 border border-primary-500 text-primary-300' : 'bg-dark-800 border border-white/5 text-slate-400 hover:border-white/20'}`}>
                  {t} presentation
                </button>
              ))}
            </div>
            <div>
              <label className="label">Academic Level</label>
              <select value={level} onChange={e => setLevel(e.target.value)} className="input-field text-sm">
                {ACADEMIC_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Number of Slides: {slideCount}</label>
              <input type="range" min={5} max={30} value={slideCount} onChange={e => setSlideCount(Number(e.target.value))}
                className="w-full accent-primary-500" />
              <div className="flex justify-between text-xs text-slate-500 mt-1"><span>5</span><span>30</span></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="card">
            <label className="label">Presentation Topic</label>
            <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={3}
              placeholder="e.g. 'The Impact of Climate Change on African Agriculture', 'Introduction to Machine Learning', 'Research Defense on Urban Planning'..."
              className="input-field resize-none mb-4" />
            <button onClick={generate} disabled={loading || !topic.trim()} className="btn-primary w-full justify-center">
              {loading ? <><FaSpinner className="animate-spin" /> Generating {slideCount} slides...</> : <><FaMagic /> Generate Presentation</>}
            </button>
          </div>

          {result && !loading && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Generated Presentation Outline</h3>
                <button onClick={copy} className="btn-secondary text-sm py-1.5">Copy All</button>
              </div>
              <div className="prose-custom overflow-y-auto max-h-[600px] pr-2">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
              </div>
            </div>
          )}

          {loading && (
            <div className="card flex flex-col items-center justify-center py-16">
              <FaDesktop className="text-primary-400" size={40} />
              <p className="text-slate-400 mt-4">Generating your presentation...</p>
              <p className="text-slate-500 text-sm">Creating {slideCount} slides with speaker notes</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
