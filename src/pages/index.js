import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  FaBrain, FaRocket, FaGraduationCap, FaChalkboardTeacher,
  FaFlask, FaImage, FaPalette, FaBook, FaShieldAlt,
  FaStar, FaCheck, FaPlay, FaMagic,
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
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-40 right-1/4 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 bg-primary-600/10 border border-primary-500/20 rounded-full px-4 py-2 text-sm font-medium text-primary-300 mb-8 animate-fade-in">
              <FaMagic className="text-primary-400" size={12} />
              <span>Powered by Tuurosung Joseph, CEO</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-tight mb-6 animate-slide-up">
              Your AI Academic
              <br />
              <span className="gradient-text animate-gradient-shift">Superpower</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in">
              BrainWave AI helps students, teachers, lecturers, and researchers across all levels excel academically with intelligent AI tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/dashboard" className="btn-primary text-base px-8 py-4 text-lg">
                <FaRocket size={18} /> Start Now
              </Link>

              <Link href="#features" className="btn-secondary text-base px-8 py-4">
                <FaPlay size={14} /> See Features
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {['✓ Instant Access', '✓ Unlimited Guest Mode', '✓ AI Ready', '✓ No Login Required'].map(t => (
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
                Powerful AI tools for every academic need.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="card group hover:scale-[1.03] cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
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

        {/* CTA */}
        <section className="py-24 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6">
              Ready to Excel Academically?
            </h2>

            <p className="text-xl text-slate-400 mb-10">
              Access BrainWave AI instantly without creating an account.
            </p>

            <Link href="/dashboard" className="btn-primary text-lg px-10 py-4 inline-flex">
              <FaRocket /> Enter Dashboard
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
