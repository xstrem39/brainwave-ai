import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { aiService } from '../../services/ai.service';
import { SUBJECTS } from '../../utils/constants';
import { FaQuestionCircle, FaSpinner, FaCopy, FaDownload, FaBolt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

export default function QuizBuilder() {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [includeAnswers, setIncludeAnswers] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const generate = async () => {
    if (!subject || !topic) { toast.error('Please select subject and enter topic'); return; }
    setLoading(true);
    setResult('');
    try {
      const prompt = `Generate ${count} ${difficulty} difficulty multiple-choice questions on "${topic}" in ${subject}.

Format each question as:
**Q[number].** [Question text]
A) [Option]
B) [Option]
C) [Option]
D) [Option]
${includeAnswers ? '✅ **Answer:** [Correct option]\n📝 **Explanation:** [Brief explanation]\n' : ''}
---

Make questions academically rigorous, clear, and educational. Ensure options are plausible.`;

      const res = await aiService.chat(prompt, { model: 'claude' });
      if (res.success) setResult(res.content);
      else toast.error(res.error || 'Quiz generation failed');
    } catch (err) { toast.error(err.message); }
    setLoading(false);
  };

  return (
    <DashboardLayout title="Quiz Builder">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">AI Quiz Builder</h1>
        <p className="text-slate-400 text-sm mt-1">Generate complete quizzes for any subject with auto-grading support</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-white mb-4">Quiz Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Subject</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} className="input-field text-sm">
                <option value="">Select subject</option>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Topic</label>
              <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Algebra, Photosynthesis..." className="input-field text-sm" />
            </div>
            <div>
              <label className="label">Number of Questions</label>
              <select value={count} onChange={e => setCount(Number(e.target.value))} className="input-field text-sm">
                {[5, 10, 15, 20, 25, 30, 40, 50].map(n => <option key={n} value={n}>{n} Questions</option>)}
              </select>
            </div>
            <div>
              <label className="label">Difficulty</label>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map(d => (
                  <button key={d} onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${difficulty === d ? 'bg-primary-600 text-white' : 'bg-dark-800 border border-white/10 text-slate-400 hover:border-primary-500/30'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={includeAnswers} onChange={e => setIncludeAnswers(e.target.checked)}
                className="w-4 h-4 accent-primary-500" />
              <span className="text-sm text-slate-300">Include answer key & explanations</span>
            </label>
            <button onClick={generate} disabled={loading || !subject || !topic} className="btn-primary w-full justify-center">
              {loading ? <><FaSpinner className="animate-spin" /> Generating...</> : <><FaBolt /> Generate Quiz</>}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {loading && (
            <div className="card flex flex-col items-center justify-center py-16">
              <FaSpinner className="text-primary-400 animate-spin" size={36} />
              <p className="text-slate-400 mt-3">Generating {count} questions...</p>
            </div>
          )}
          {result && !loading && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">{subject} Quiz — {topic}</h3>
                <div className="flex gap-2">
                  <button onClick={() => { navigator.clipboard.writeText(result); toast.success('Copied!'); }}
                    className="btn-secondary text-sm py-1.5 px-3"><FaCopy size={12} /> Copy</button>
                </div>
              </div>
              <div className="prose-custom overflow-y-auto max-h-[700px] pr-2">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>
          )}
          {!result && !loading && (
            <div className="card flex flex-col items-center justify-center py-20 text-center">
              <FaQuestionCircle className="text-slate-600" size={48} />
              <p className="text-slate-500 mt-4">Configure your quiz settings and generate</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
