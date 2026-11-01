import React from 'react';
import { GraduationCap, Phone, Mail, MapPin, MessageSquare, ArrowUp, Shield } from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';

interface FooterProps {
  onEnquireClick: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onEnquireClick, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0F1E36] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Brand & Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <span className="text-xl font-bold font-['Plus_Jakarta_Sans'] tracking-tight">
                {ACADEMY_CONFIG.name}
              </span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              Empowering students with concept-driven clarity, structured pedagogy, and continuous personal mentorship for competitive and board success.
            </p>

            <div className="pt-2 text-xs text-slate-400">
              <span className="block font-semibold text-slate-200">Registered Office:</span>
              <span className="block mt-0.5">{ACADEMY_CONFIG.address}</span>
            </div>

            {/* Social media placeholders */}
            <div className="pt-2 flex items-center gap-2.5">
              <span className="text-xs text-slate-400 mr-1">Connect:</span>
              {['YouTube', 'Telegram', 'Instagram', 'LinkedIn'].map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => alert(`In production, this links to ${ACADEMY_CONFIG.name}'s official ${platform} handle.`)}
                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF6B35]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="#home" className="hover:text-white transition-colors">
                  Home Overview
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-white transition-colors">
                  Academic Programs
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-white transition-colors">
                  Why Choose Us
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  Faculty & Leadership
                </a>
              </li>
              <li>
                <a href="#results" className="hover:text-white transition-colors">
                  Student Results
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Course Registration
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Courses */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF6B35]">
              Key Programs
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {ACADEMY_CONFIG.courses.map((c) => (
                <li key={c.id}>
                  <a href="#courses" className="hover:text-white transition-colors">
                    {c.title}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Free Diagnostic Test
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Direct Action Desk */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF6B35]">
              Admissions Help
            </h4>
            <p className="text-xs text-slate-300">
              Speak with our senior counselor or book a trial class today.
            </p>

            <button
              type="button"
              onClick={onEnquireClick}
              className="w-full py-2.5 px-3 text-xs font-bold text-white bg-gradient-to-r from-[#FF6B35] to-[#FA8A3C] rounded-lg shadow-sm hover:from-[#E8551F] hover:to-[#FF6B35] transition-all"
            >
              Book Free Demo Class
            </button>

            <button
              type="button"
              onClick={onEnquireClick}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>{ACADEMY_CONFIG.phoneDisplay}</span>
            </button>

            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-amber-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-amber-400/20"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Staff & Admin Portal</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© {new Date().getFullYear()} {ACADEMY_CONFIG.name}. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-600">·</span>
            <span className="text-slate-400">Persistent Course Registration & Management System.</span>
          </div>

          <div className="flex items-center gap-4">
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="hover:text-white transition-colors"
              >
                Admin Login
              </button>
            )}
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors text-xs"
              aria-label="Scroll back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
