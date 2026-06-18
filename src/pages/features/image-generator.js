import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { aiService } from '../../services/ai.service';
import { useAuth } from '../../context/AuthContext';
import { IMAGE_TYPES } from '../../utils/constants';
import { FaImage, FaSpinner, FaDownload, FaCopy, FaMagic, FaCoins } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ImageGenerator() {
  const { credits, refreshCredits } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState('realistic');
  const [size, setSize] = useState('1024x1024');
  const [quality, setQuality] = useState('hd');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const generate = async () => {
    if (!prompt.trim()) { toast.error('Please enter an image description'); return; }
    if (credits < 10) { toast.error('Insufficient credits. You need at least 10 credits.'); return; }
    setLoading(true);
    setResult(null);
    try {
      const res = await aiService.generateImage(prompt, { type, size, quality });
      if (res.success) {
        setResult(res);
        setHistory(prev => [{ url: res.url, prompt, type, date: new Date() }, ...prev.slice(0, 11)]);
        await refreshCredits();
        toast.success('Image generated! 10 credits used.');
      } else {
        toast.error(res.error || 'Image generation failed');
      }
    } catch (err) {
      toast.error(err.message || 'Image generation failed');
    }
    setLoading(false);
  };

  const downloadImage = async (url) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `brainwave-image-${Date.now()}.png`;
      a.click();
    } catch {
      window.open(url, '_blank');
    }
  };

  const suggestions = [
    'A detailed diagram of the human digestive system', 'Infographic showing the water cycle',
    'Professional logo for an educational institution', 'Bar chart comparing GDP of African countries',
    'Scientific illustration of DNA replication', 'School event poster with modern design',
  ];

  return (
    <DashboardLayout title="Image Generator">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Image Generator</h1>
          <p className="text-slate-400 text-sm mt-1">Generate ultra-HD academic diagrams, logos, posters, and any image type</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
          <FaCoins className="text-amber-400" size={14} />
          <span className="text-amber-300 font-medium">{credits} credits</span>
          <span className="text-slate-500 text-sm">(10 per image)</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-5">
          <div className="card">
            <label className="label">Image Type</label>
            <div className="grid grid-cols-2 gap-2">
              {IMAGE_TYPES.map(t => (
                <button key={t.id} onClick={() => setType(t.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${type === t.id ? 'bg-primary-600/20 border border-primary-500/40 text-primary-300' : 'bg-dark-800 border border-white/5 text-slate-400 hover:border-white/20'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <label className="label">Resolution</label>
            <select value={size} onChange={e => setSize(e.target.value)} className="input-field text-sm">
              <option value="1024x1024">1024×1024 (Square)</option>
              <option value="1792x1024">1792×1024 (Landscape)</option>
              <option value="1024x1792">1024×1792 (Portrait)</option>
            </select>
            <label className="label mt-3">Quality</label>
            <div className="flex gap-2">
              {['standard', 'hd'].map(q => (
                <button key={q} onClick={() => setQuality(q)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${quality === q ? 'bg-primary-600 text-white' : 'bg-dark-800 border border-white/10 text-slate-400 hover:border-primary-500/30'}`}>
                  {q === 'hd' ? '⭐ HD' : 'Standard'}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <p className="text-xs text-slate-400 font-medium mb-2">Prompt Suggestions:</p>
            <div className="space-y-1">
              {suggestions.map(s => (
                <button key={s} onClick={() => setPrompt(s)}
                  className="w-full text-left text-xs text-slate-500 hover:text-primary-300 py-1 px-2 rounded hover:bg-primary-500/5 transition-all">
                  "{s}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card">
            <label className="label">Image Description</label>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
              rows={4} placeholder="Describe the image you want to generate... Be specific about style, colors, content, and purpose."
              className="input-field resize-none mb-4" />
            <button onClick={generate} disabled={loading || !prompt.trim()} className="btn-primary w-full justify-center py-3">
              {loading ? <><FaSpinner className="animate-spin" size={16} /> Generating... (30-60 seconds)</> : <><FaMagic size={16} /> Generate Image (10 credits)</>}
            </button>
          </div>

          {/* Result */}
          {loading && (
            <div className="card flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-primary-600/20 flex items-center justify-center mb-4 animate-pulse">
                <FaImage className="text-primary-400" size={28} />
              </div>
              <p className="text-slate-400">Generating your image with DALL-E 3...</p>
              <p className="text-slate-500 text-sm mt-1">This usually takes 30-60 seconds</p>
            </div>
          )}

          {result && !loading && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">Generated Image</h3>
                <div className="flex gap-2">
                  <button onClick={() => downloadImage(result.url)} className="btn-secondary text-sm py-1.5 px-3">
                    <FaDownload size={13} /> Download
                  </button>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-white/10">
                <img src={result.url} alt={prompt} className="w-full object-contain max-h-[600px]" />
              </div>
              {result.revisedPrompt && (
                <p className="text-xs text-slate-500 mt-3">
                  <strong className="text-slate-400">Revised prompt:</strong> {result.revisedPrompt}
                </p>
              )}
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-white mb-3">Recent Generations</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {history.map((h, i) => (
                  <div key={i} className="relative group cursor-pointer rounded-lg overflow-hidden border border-white/10 hover:border-primary-500/40 transition-all"
                    onClick={() => setResult({ url: h.url })}>
                    <img src={h.url} alt={h.prompt} className="w-full aspect-square object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <p className="text-xs text-white truncate">{h.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
