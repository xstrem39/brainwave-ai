import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { aiService } from '../../services/ai.service';
import { SUBJECTS } from '../../utils/constants';
import { FaFileExcel, FaSpinner, FaCopy, FaBolt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

export default function ExamBuilder() {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(60);
  const [sections, setSections] = useState({ mcq: 10, theory: 5, practical: 0 });
  const [includeMarkingScheme, setIncludeMarkingScheme] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const generate = async () => {
    if (!subject || !topic) { toast.error('Please select subject and enter topic'); return; }
    setLoading(true);
    setResult('');
    try {
      const prompt = `Create a complete academic exam on "${topic}" in ${subject}.

Exam Duration: ${duration} minutes

SECTIONS:
${sections.mcq > 0 ? `Section A: Multiple Choice Questions (${sections.mcq} questions, 1 mark each)` : ''}
${sections.theory > 0 ? `Section B: Theory/Essay Questions (${sections.theory} questions, 10 marks each)` : ''}
${sections.practical > 0 ? `Section C: Practical/Calculations (${sections.practical} questions, 15 marks each)` : ''}

Format:
- Professional exam header (School, Subject, Duration, Total Marks)
- Clear instructions for each section
- Well-structured questions
- Proper spacing

${includeMarkingScheme ? '\n---\nMARKING SCHEME:\nProvide detailed marking scheme for all questions.' : ''}

Make it exam-ready, professional, and academically rigorous.`;

      const res = await aiService.chat(prompt, { model: 'claude' });
      if (res.success) setResult(res.content);
      else toast.error(res.error || 'Exam generation failed');
    } catch (err) { toast.error(err.message); }
    setLoading(false);
  };

  return (
    <DashboardLayout title="Exam Builder">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Exam Builder</h1>
        <p className="text-slate-400 text-sm mt-1">Create complete exams with marking schemes for any subject</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-white mb-4">Exam Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Subject</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} className="input-field text-sm">
                <option value="">Select subject</option>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Topic(s)</label>
              <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Algebra & Trigonometry" className="input-field text-sm" />
            </div>
            <div>
              <label className="label">Duration (minutes)</label>
              <select value={duration} onChange={e => setDuration(Number(e.target.value))} className="input-field text-sm">
                {[30, 45, 60, 90, 120, 150, 180].map(d => <option key={d} value={d}>{d} minutes</option>)}
              </select>
            </div>
            <div>
              <label className="label">Section A — Multiple Choice</label>
              <input type="number" value={sections.mcq} onChange={e => setSections(p => ({ ...p, mcq: Number(e.target.value) }))} min={0} max={60} className="input-field text-sm" />
            </div>
            <div>
              <label className="label">Section B — Theory Questions</label>
              <input type="number" value={sections.theory} onChange={e => setSections(p => ({ ...p, theory: Number(e.target.value) }))} min={0} max={20} className="input-field text-sm" />
            </div>
            <div>
              <label className="label">Section C — Practical/Calculation</label>
              <input type="number" value={sections.practical} onChange={e => setSections(p => ({ ...p, practical: Number(e.target.value) }))} min={0} max={10} className="input-field text-sm" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={includeMarkingScheme} onChange={e => setIncludeMarkingScheme(e.target.checked)} className="w-4 h-4 accent-primary-500" />
              <span className="text-sm text-slate-300">Include marking scheme</span>
            </label>
            <button onClick={generate} disabled={loading} className="btn-primary w-full justify-center">
              {loading ? <><FaSpinner className="animate-spin" /> Building exam...</> : <><FaBolt /> Generate Exam</>}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {loading && (
            <div className="card flex flex-col items-center justify-center py-16">
              <FaSpinner className="text-primary-400 animate-spin" size={36} />
              <p className="text-slate-400 mt-3">Building your complete exam...</p>
            </div>
          )}
          {result && !loading && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">{subject} — {topic} Exam</h3>
                <button onClick={() => { navigator.clipboard.writeText(result); toast.success('Copied!'); }}
                  className="btn-secondary text-sm py-1.5 px-3"><FaCopy size={12} /> Copy</button>
              </div>
              <div className="prose-custom overflow-y-auto max-h-[700px] pr-2">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>
          )}
          {!result && !loading && (
            <div className="card flex flex-col items-center justify-center py-20 text-center">
              <FaFileExcel className="text-slate-600" size={48} />
              <p className="text-slate-500 mt-4">Configure your exam and click Generate</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
