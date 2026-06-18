import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { aiService } from '../../services/ai.service';
import { useAuth } from '../../context/AuthContext';
import { FLYER_TYPES } from '../../utils/constants';
import { FaPalette, FaSpinner, FaDownload, FaMagic, FaCoins } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function FlyerGenerator() {
  const { credits, refreshCredits } = useAuth();
  const [form, setForm] = useState({ title: '', type: 'event', description: '', date: '', venue: '', contact: '', colors: 'blue and white', style: 'modern' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generate = async () => {
    if (!form.title) { toast.error('Please enter a flyer title'); return; }
    if (credits < 15) { toast.error('You need at least 15 credits'); return; }
    setLoading(true);
    try {
      const prompt = `Create a professional ${form.type} flyer with the following details:
Title: ${form.title}
Type: ${form.type}
Description: ${form.description || 'N/A'}
Date/Time: ${form.date || 'N/A'}
Venue: ${form.venue || 'N/A'}
Contact: ${form.contact || 'N/A'}
Color scheme: ${form.colors}
Style: ${form.style}

Design a stunning, professional flyer image. Make it eye-catching, modern, and suitable for print and digital use. Include all the provided information in a visually appealing layout.`;

      const res = await aiService.generateImage(prompt, { type: 'poster', size: '1024x1792', quality: 'hd' });
      if (res.success) {
        setResult(res);
        await refreshCredits();
        toast.success('Flyer generated! 15 credits used.');
      } else toast.error(res.error || 'Flyer generation failed');
    } catch (err) { toast.error(err.message); }
    setLoading(false);
  };

  const update = (field, value) => setForm(p => ({ ...p, [field]: value }));

  return (
    <DashboardLayout title="Flyer Generator">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Flyer Generator</h1>
          <p className="text-slate-400 text-sm mt-1">Create stunning professional flyers powered by AI</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
          <FaCoins className="text-amber-400" size={14} />
          <span className="text-amber-300 font-medium">{credits}</span>
          <span className="text-slate-500 text-sm">(15 per flyer)</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="card">
            <label className="label">Flyer Type</label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {FLYER_TYPES.map(t => (
                <button key={t.id} onClick={() => update('type', t.id)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${form.type === t.id ? 'bg-primary-600/20 border border-primary-500 text-primary-300' : 'bg-dark-800 border border-white/5 text-slate-400 hover:border-white/20'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            <label className="label">Event/Flyer Title *</label>
            <input value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Annual Science Fair 2024" className="input-field mb-3" />

            <label className="label">Description</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3} placeholder="Brief description of the event or content..." className="input-field resize-none mb-3" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Date & Time</label>
                <input value={form.date} onChange={e => update('date', e.target.value)} placeholder="e.g. March 15, 2025, 10am" className="input-field text-sm" />
              </div>
              <div>
                <label className="label">Venue</label>
                <input value={form.venue} onChange={e => update('venue', e.target.value)} placeholder="Location" className="input-field text-sm" />
              </div>
            </div>

            <label className="label mt-3">Contact Information</label>
            <input value={form.contact} onChange={e => update('contact', e.target.value)} placeholder="Phone, email, or website" className="input-field mb-3" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Color Scheme</label>
                <select value={form.colors} onChange={e => update('colors', e.target.value)} className="input-field text-sm">
                  {['blue and white', 'red and white', 'green and white', 'purple and gold', 'black and gold', 'orange and white', 'custom'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Style</label>
                <select value={form.style} onChange={e => update('style', e.target.value)} className="input-field text-sm">
                  {['modern', 'classic', 'minimalist', 'bold', 'elegant', 'fun', 'professional'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <button onClick={generate} disabled={loading || !form.title} className="btn-primary w-full justify-center mt-4">
              {loading ? <><FaSpinner className="animate-spin" /> Designing your flyer...</> : <><FaMagic /> Generate Flyer (15 credits)</>}
            </button>
          </div>
        </div>

        <div>
          {loading && (
            <div className="card flex flex-col items-center justify-center py-20">
              <FaSpinner className="text-primary-400 animate-spin" size={40} />
              <p className="text-slate-400 mt-4">Creating your professional flyer...</p>
              <p className="text-slate-500 text-sm">This takes about 30-60 seconds</p>
            </div>
          )}
          {result && !loading && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">Your Flyer</h3>
                <button onClick={() => window.open(result.url, '_blank')} className="btn-secondary text-sm py-1.5 px-3">
                  <FaDownload size={13} /> Download
                </button>
              </div>
              <div className="rounded-xl overflow-hidden border border-white/10">
                <img src={result.url} alt="Generated flyer" className="w-full" />
              </div>
            </div>
          )}
          {!result && !loading && (
            <div className="card flex flex-col items-center justify-center py-20 text-center">
              <FaPalette className="text-slate-600" size={48} />
              <p className="text-slate-500 mt-4">Fill in the details and generate your flyer</p>
              <p className="text-slate-600 text-sm">Ultra-HD, print-ready quality</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
