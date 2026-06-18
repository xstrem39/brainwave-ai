import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { aiService } from '../../services/ai.service';
import { SUBJECTS } from '../../utils/constants';
import { FaClipboard, FaSpinner, FaCheck, FaTimes, FaClock, FaTrophy } from 'react-icons/fa';
import { gradeFromPercentage } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ExamPrep() {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timer, setTimer] = useState(null);

  const generate = async () => {
    if (!subject || !topic) { toast.error('Please select subject and enter topic'); return; }
    setLoading(true);
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setResult(null);
    try {
      const res = await aiService.generateQuiz(subject, topic, count, difficulty);
      if (res.success && res.questions) {
        setQuestions(res.questions);
        const secs = count * 60;
        setTimeLeft(secs);
        const t = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) { clearInterval(t); submit(res.questions); return 0; }
            return prev - 1;
          });
        }, 1000);
        setTimer(t);
        toast.success(`${res.questions.length} questions generated!`);
      } else toast.error(res.error || 'Failed to generate questions');
    } catch (err) { toast.error(err.message); }
    setLoading(false);
  };

  const submit = (qs = questions) => {
    if (timer) clearInterval(timer);
    let correct = 0;
    const detailed = qs.map((q, i) => {
      const isCorrect = answers[i] === q.answer;
      if (isCorrect) correct++;
      return { ...q, userAnswer: answers[i], isCorrect };
    });
    const pct = Math.round((correct / qs.length) * 100);
    setResult({ correct, total: qs.length, percentage: pct, detailed });
    setSubmitted(true);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const reset = () => {
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setResult(null);
    setTimeLeft(null);
    if (timer) clearInterval(timer);
  };

  return (
    <DashboardLayout title="Exam Preparation">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Exam Preparation</h1>
        <p className="text-slate-400 text-sm mt-1">AI-generated mock exams with auto-grading and explanations</p>
      </div>

      {!questions.length && !loading && (
        <div className="card max-w-2xl">
          <h3 className="font-semibold text-white mb-4">Generate Practice Exam</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Subject</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} className="input-field">
                <option value="">Select subject...</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Topic</label>
              <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Quadratic equations, World War II, Cell biology..."
                className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Number of Questions</label>
                <select value={count} onChange={e => setCount(Number(e.target.value))} className="input-field">
                  {[5, 10, 15, 20, 25, 30].map(n => <option key={n} value={n}>{n} Questions</option>)}
                </select>
              </div>
              <div>
                <label className="label">Difficulty</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="input-field">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>
            <button onClick={generate} disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? <><FaSpinner className="animate-spin" /> Generating exam...</> : <><FaClipboard /> Generate Exam</>}
            </button>
          </div>
        </div>
      )}

      {questions.length > 0 && !submitted && (
        <div>
          {/* Timer + progress */}
          <div className="flex items-center justify-between mb-6 sticky top-20 bg-dark-900/95 backdrop-blur-sm py-3 z-10">
            <div className="flex items-center gap-2 text-primary-300">
              <FaCheck size={14} /> {Object.keys(answers).length}/{questions.length} answered
            </div>
            {timeLeft !== null && (
              <div className={`flex items-center gap-2 font-mono font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-amber-400'}`}>
                <FaClock /> {formatTime(timeLeft)}
              </div>
            )}
            <button onClick={() => submit()} className="btn-primary text-sm py-2">Submit Exam</button>
          </div>

          <div className="space-y-6">
            {questions.map((q, i) => (
              <div key={i} className="card">
                <p className="font-medium text-white mb-4">Q{i + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <button key={oi} onClick={() => setAnswers(prev => ({ ...prev, [i]: opt }))}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${answers[i] === opt ? 'bg-primary-600/20 border border-primary-500 text-primary-300' : 'bg-dark-800 border border-white/5 text-slate-300 hover:border-white/20'}`}>
                      <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span> {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <button onClick={() => submit()} className="btn-primary px-12">Submit Exam</button>
          </div>
        </div>
      )}

      {submitted && result && (
        <div>
          <div className="card border-2 text-center mb-6" style={{ borderColor: gradeFromPercentage(result.percentage).color.replace('text-', '') }}>
            <FaTrophy className="text-amber-400 mx-auto mb-3" size={40} />
            <h2 className="text-3xl font-black text-white mb-1">{result.percentage}%</h2>
            <p className="text-xl font-bold mb-2" style={{ color: gradeFromPercentage(result.percentage).color.replace('text-', '#') }}>
              Grade {gradeFromPercentage(result.percentage).grade} — {gradeFromPercentage(result.percentage).label}
            </p>
            <p className="text-slate-400">{result.correct}/{result.total} correct answers</p>
            <button onClick={reset} className="btn-primary mt-4">Try Again</button>
          </div>

          <div className="space-y-4">
            {result.detailed.map((q, i) => (
              <div key={i} className={`card border ${q.isCorrect ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${q.isCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                    {q.isCorrect ? <FaCheck className="text-emerald-400" size={12} /> : <FaTimes className="text-red-400" size={12} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm mb-2">Q{i + 1}. {q.question}</p>
                    <p className="text-xs text-slate-400">Your answer: <span className={q.isCorrect ? 'text-emerald-400' : 'text-red-400'}>{q.userAnswer || 'Not answered'}</span></p>
                    {!q.isCorrect && <p className="text-xs text-emerald-400">Correct: {q.answer}</p>}
                    {q.explanation && <p className="text-xs text-slate-400 mt-2 bg-dark-800 rounded-lg p-2">{q.explanation}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
