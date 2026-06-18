import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  FaBrain, FaRocket, FaGraduationCap, FaChalkboardTeacher,
  FaFlask, FaImage, FaPalette, FaBook, FaShieldAlt,
  FaStar, FaCheck, FaArrowRight, FaPlay, FaMagic,
  FaQuoteLeft, FaUsers, FaBolt, FaGlobe,
} from 'react-icons/fa';

const features = [
  { icon: FaBrain, title: 'Academic Assistant', desc: 'Solve math, physics, chemistry, economics, and any academic question instantly.', color: 'from-blue-600 to-indigo-600' },
  { icon: FaBook, title: 'Assignment Helper', desc: 'Generate, solve, explain, and improve assignments with expert AI guidance.', color: 'from-purple-600 to-pink-600' },
  { icon: FaFlask, title: 'Research Assistant', desc: 'Full research support: proposals, literature reviews, methodology, citations.', color: 'from-cyan-600 to-blue-600' },
  { icon: FaGraduationCap, title: 'Exam Preparation', desc: 'Mock exams, timed tests, auto-marking, and performance analytics.', color: 'from-emerald-600 to-cyan-600' },
  { icon: FaImage, title: 'Image Generator', desc: 'Create ultra-HD academic diagrams, infographics, logos, and any image type.', color: 'from-orange-600 to-red-600' },
  { icon: FaPalette, title: 'Flyer Creator', desc: 'Design professional flyers for events, schools, churches, and businesses.', color: 'from-pink-600 to-purple-600' },
  { icon: FaChalkboardTeacher, title: 'Teacher Tools', desc: 'Build quizzes, exams, lesson plans, and track student performance.', color: 'from-amber-600 to-orange-600' },
  { icon: FaShieldAlt, title: 'Writing Assistant', desc: 'Essays, reports, thesis writing, grammar correction, and paraphrasing.', color: 'from-green-600 to-emerald-600' },
];

const stats = [
  { label: 'Students Served', value: '50,000+', icon: FaUsers },
  { label: 'AI Responses/Day', value: '200,000+', icon: FaBolt },
  { label: 'Countries', value: '15+', icon: FaGlobe },
  { label: 'Academic Subjects', value: '30+', icon: FaBook },
];

const testimonials = [
  { name: 'Kwame A.', role: 'University Student, Ghana', text: 'BrainWave AI helped me write my thesis proposal in minutes. The research assistant is incredible!', rating: 5 },
  { name: 'Mrs. Mensah', role: 'High School Teacher, Accra', text: 'I use it daily to create quizzes and lesson plans. It saves me hours of work every week.', rating: 5 },
  { name: 'Dr. Osei', role: 'PhD Researcher', text: 'The literature review generation and citation tools are world-class. Highly recommended for academics.', rating: 5 },
];

export default function HomePage() {
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentFeature(i => (i + 1) % features.length), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>BrainWave AI — Powering Academic Excellence with AI</title>
      </Head>
      <div className="min-h-screen bg-dark-900 grid-pattern">
        <Navbar />

        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background glows */}
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-40 right-1/4 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto text-center relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-600/10 border border-primary-500/20 rounded-full px-4 py-2 text-sm font-medium text-primary-300 mb-8 animate-fade-in">
              <FaMagic className="text-primary-400" size={12} />
              <span>Powered by Claude, GPT-4o & Gemini Pro</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-tight mb-6 animate-slide-up">
              Your AI Academic
              <br />
              <span className="gradient-text animate-gradient-shift">Superpower</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in">
              BrainWave AI helps students, teachers, lecturers, and researchers across all levels excel academically with intelligent AI tools — from solving equations to generating research proposals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/register" className="btn-primary text-base px-8 py-4 text-lg">
                <FaRocket size={18} /> Start Free Trial — 7 Days
              </Link>
              <Link href="#features" className="btn-secondary text-base px-8 py-4">
                <FaPlay size={14} /> See Features
              </Link>
            </div>

            {/* Floating feature badges */}
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {['✓ No Credit Card Required', '✓ 100 Free Credits', '✓ Instant Access', '✓ Ghana-Based Payments'].map(t => (
                <span key={t} className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-slate-400">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-y border-white/5 bg-dark-800/50">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label}>
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="text-primary-400" size={20} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
                  <div className="text-sm text-slate-400">{s.label}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title text-white mb-4">Everything You Need to Excel</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Powerful AI tools for every academic need — from primary school to PhD level
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="card group hover:scale-[1.03] cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-transform`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* For Everyone */}
        <section className="py-24 px-4 bg-dark-800/50 border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title text-white mb-4">Built for Everyone in Academia</h2>
              <p className="text-xl text-slate-400">From primary school to university and beyond</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'For Students', icon: '🎓', points: ['Solve any problem instantly', 'Generate & improve assignments', 'Full exam preparation', 'Research & citation help', 'Study notes & flashcards'] },
                { title: 'For Teachers', icon: '📚', points: ['Build quizzes & exams instantly', 'Generate lesson plans', 'AI grading & feedback', 'Student performance tracking', 'Curriculum mapping'] },
                { title: 'For Researchers', icon: '🔬', points: ['Research proposals', 'Literature reviews', 'Methodology writing', 'Data analysis guidance', 'APA/MLA/Harvard citations'] },
              ].map(group => (
                <div key={group.title} className="card border-2 border-primary-500/10 hover:border-primary-500/30 transition-all">
                  <div className="text-4xl mb-4">{group.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-4">{group.title}</h3>
                  <ul className="space-y-2">
                    {group.points.map(p => (
                      <li key={p} className="flex items-center gap-2 text-sm text-slate-400">
                        <FaCheck className="text-emerald-400 flex-shrink-0" size={12} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="section-title text-white mb-4">Simple, Affordable Pricing</h2>
            <p className="text-xl text-slate-400 mb-12">In Ghana Cedis. Cancel anytime.</p>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {[
                { name: 'Monthly Pro', price: 'GHS 200', period: '/month', highlight: false, features: ['500 credits/month', 'All AI tools', 'Image generation', 'Research assistant', 'Priority support'] },
                { name: 'Yearly Pro', price: 'GHS 2,000', period: '/year', highlight: true, badge: 'Best Value — Save GHS 400', features: ['7,000 credits/year', 'All Monthly features', '+500 bonus credits', 'Advanced analytics', 'Dedicated support'] },
              ].map(plan => (
                <div key={plan.name} className={`subscription-card ${plan.highlight ? 'border-primary-500 shadow-glow' : 'border-white/10'}`}>
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge-primary text-xs whitespace-nowrap">{plan.badge}</div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                        <FaCheck className="text-emerald-400 flex-shrink-0" size={12} /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/subscription/plans" className={plan.highlight ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}>
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-sm">7-day free trial included with every new account. Payments via Paystack (Card, Mobile Money, Bank).</p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-4 bg-dark-800/50 border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="section-title text-white text-center mb-12">Loved by Academics</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="card">
                  <FaQuoteLeft className="text-primary-500/40 mb-4" size={24} />
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                    <div className="ml-auto flex text-amber-400">
                      {Array(t.rating).fill(0).map((_, i) => <FaStar key={i} size={12} />)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6">
              Ready to Excel Academically?
            </h2>
            <p className="text-xl text-slate-400 mb-10">
              Join thousands of students, teachers, and researchers already using BrainWave AI.
            </p>
            <Link href="/register" className="btn-primary text-lg px-10 py-4 inline-flex">
              <FaRocket /> Start Free — 7 Days, No Card Needed
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
