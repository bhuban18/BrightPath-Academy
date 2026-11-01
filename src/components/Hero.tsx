import React from 'react';
import { ArrowRight, BookOpen, CheckCircle2, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';

interface HeroProps {
  onExploreCourses: () => void;
  onBookDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCourses, onBookDemo }) => {
  return (
    <section id="home" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9]/60">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f00a_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f00a_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline and Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Academic Quality Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#FF6B35]" />
              <span>Admissions Open for Academic Session 2026–2027</span>
              <span className="text-slate-300">|</span>
              <span className="text-[#0F1E36] font-bold">Target JEE · NEET · Foundations</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#0F1E36] tracking-tight leading-[1.12] [text-wrap:balance]">
              Your Goals.{' '}
              <span className="text-[#FF6B35]">Our Guidance.</span>{' '}
              <br className="hidden sm:inline" />
              Your Success.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              Build strong concepts, develop confidence, and prepare for your academic goals with structured learning and personalised guidance.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={onExploreCourses}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[#FF6B35] to-[#FA8A3C] hover:from-[#E8551F] hover:to-[#FF6B35] rounded-xl shadow-[0_4px_14px_rgba(255,107,53,0.3)] hover:shadow-[0_6px_20px_rgba(255,107,53,0.4)] transition-all duration-200"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onBookDemo}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#0F1E36] bg-white hover:bg-slate-50 border-1.5 border-[#0F1E36] rounded-xl shadow-xs transition-colors duration-150"
              >
                <BookOpen className="w-4 h-4 text-[#FF6B35]" />
                <span>Book a Free Demo</span>
              </button>
            </div>

            {/* Trust Bullet Strip */}
            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Strict 25:1 Student Ratio</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Daily 1-on-1 Doubt Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Curated Printed Modules</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative background aura */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#0F1E36]/10 to-[#FF6B35]/15 rounded-3xl blur-xl transform -rotate-1" />

              {/* Card Container */}
              <div className="relative bg-white p-2.5 rounded-2xl shadow-[0_15px_35px_rgba(15,30,54,0.08)] border border-slate-200">
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100">
                  <img
                    src="/src/assets/images/brightpath_hero_classroom_1793551303662.jpg"
                    alt="BrightPath Academy students studying diligently with textbooks and study materials in library"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback if image fails
                      (e.target as HTMLElement).style.display = 'none';
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent) {
                        parent.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'p-8', 'bg-slate-900', 'text-white');
                        parent.innerHTML = `
                          <div class="text-center">
                            <span class="text-3xl font-bold text-[#FF6B35] font-['Plus_Jakarta_Sans']">BrightPath Academy</span>
                            <p class="text-sm text-slate-300 mt-2">Nurturing Scientific Minds & Academic Rigor</p>
                          </div>
                        `;
                      }
                    }}
                  />
                  {/* Subtle Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Caption inside image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#FF6B35]">
                      Academic Excellence
                    </p>
                    <p className="text-sm font-medium drop-shadow-sm">
                      Focused Classroom Batches & Personalized Doubt Mentorship
                    </p>
                  </div>
                </div>

                {/* Micro trust stats card below image */}
                <div className="mt-3 p-3 bg-[#F8FAFC] rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0F1E36] flex items-center justify-center text-white">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0F1E36]">100% Concept-First</p>
                      <p className="text-[11px] text-slate-500">Board + Entrance Alignment</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Free Demo Class
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Horizontal Trust Strip below hero */}
        <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6">
          {ACADEMY_CONFIG.trustBadges.map((badge, idx) => (
            <div key={idx} className="flex flex-col text-left">
              <span className="text-sm font-bold text-[#0F1E36] tracking-tight">
                {badge.label}
              </span>
              <span className="text-xs text-slate-500 mt-0.5">
                {badge.subtext}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
