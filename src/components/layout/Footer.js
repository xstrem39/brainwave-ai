import Link from 'next/link';
import { FaBrain, FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { APP_NAME, COMPANY } from '../../utils/constants';

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center">
                <FaBrain className="text-white" size={18} />
              </div>
              <span className="font-display font-bold text-lg">
                <span className="gradient-text">BrainWave</span>
                <span className="text-white"> AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              AI-powered academic assistant for students, teachers, lecturers, and researchers across all educational levels.
            </p>
            <div className="flex items-center gap-3">
              {[FaTwitter, FaFacebook, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-600/20 transition-all">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-white mb-4">Features</h4>
            <ul className="space-y-2">
              {['Academic Assistant', 'Research Helper', 'Exam Preparation', 'Study Tools', 'Image Generator', 'Flyer Creator', 'Writing Assistant', 'Quiz Builder'].map(f => (
                <li key={f}><a href="#" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">{f}</a></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {[['About Us', '#'], ['Pricing', '/subscription/plans'], ['Blog', '#'], ['Careers', '#'], ['Contact', '#'], ['Privacy Policy', '#'], ['Terms of Service', '#']].map(([label, href]) => (
                <li key={label}><Link href={href} className="text-sm text-slate-400 hover:text-primary-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Status Page</a></li>
            </ul>
            <div className="mt-6 p-4 bg-primary-600/10 border border-primary-500/20 rounded-xl">
              <p className="text-sm font-medium text-white mb-1">7-Day Free Trial</p>
              <p className="text-xs text-slate-400 mb-3">Start with 100 free credits. No credit card required.</p>
              <Link href="/register" className="btn-primary text-xs w-full justify-center">Try Free Now</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} {APP_NAME} — {COMPANY}. All rights reserved.
          </p>
          <p className="text-sm text-slate-600">Built with ❤️ for African academic excellence</p>
        </div>
      </div>
    </footer>
  );
}
