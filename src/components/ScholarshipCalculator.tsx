import React, { useState } from 'react';
import { Calculator, Award, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface ScholarshipCalculatorProps {
  onClaimScholarship: (percentage: number, waiver: number) => void;
}

export const ScholarshipCalculator: React.FC<ScholarshipCalculatorProps> = ({ onClaimScholarship }) => {
  const [boardScore, setBoardScore] = useState<number>(92);

  // Compute fee waiver slab
  const getScholarshipTier = (score: number) => {
    if (score >= 95) return { waiver: 50, title: 'Super Achiever Scholarship', badge: 'Diamond Tier' };
    if (score >= 90) return { waiver: 35, title: 'Merit Excellence Award', badge: 'Gold Tier' };
    if (score >= 85) return { waiver: 25, title: 'Academic Distinction Grant', badge: 'Silver Tier' };
    if (score >= 75) return { waiver: 15, title: 'Early Aspirant Concession', badge: 'Bronze Tier' };
    return { waiver: 10, title: 'Foundation Encouragement Grant', badge: 'Standard Tier' };
  };

  const tier = getScholarshipTier(boardScore);

  return (
    <section className="py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-[#0F1E36] to-[#1A2E4D] text-white p-6 sm:p-10 shadow-xl overflow-hidden relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B35]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Description & Interactive Slider (7 cols) */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[#FF6B35] border border-white/10">
                <Calculator className="w-3.5 h-3.5" />
                <span>Merit Scholarship Estimator</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans']">
                Check Your Eligible Fee Waiver
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed">
                We reward academic dedication. Move the slider to your latest school or board examination score to see your estimated fee concession.
              </p>

              {/* Slider Input */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Previous Exam / Board Score:</span>
                  <span className="text-2xl font-black text-[#FF6B35] font-['Plus_Jakarta_Sans'] tabular-nums">
                    {boardScore}%
                  </span>
                </div>

                <input
                  type="range"
                  min="60"
                  max="100"
                  step="1"
                  value={boardScore}
                  onChange={(e) => setBoardScore(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
                  aria-label="Board score percentage slider"
                />

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>60% (Passing)</span>
                  <span>75% (First Div)</span>
                  <span>90% (Distinction)</span>
                  <span>100% (Centum)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Scholarship Result Card (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl p-6 text-slate-900 shadow-lg text-center border-2 border-[#FF6B35]/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {tier.badge}
                </span>

                <div className="text-4xl sm:text-5xl font-black text-[#0F1E36] font-['Plus_Jakarta_Sans'] tabular-nums">
                  {tier.waiver}% <span className="text-lg font-bold text-[#FF6B35]">Off</span>
                </div>

                <h4 className="text-sm font-bold text-slate-800 mt-2">
                  {tier.title}
                </h4>

                <p className="text-xs text-slate-500 mt-1">
                  Applicable on annual tuition fees across Class 9–12, JEE & NEET cohorts upon marks verification.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Valid for 2026–27 Academic Intake</span>
                </div>

                <button
                  type="button"
                  onClick={() => onClaimScholarship(boardScore, tier.waiver)}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-[#FF6B35] to-[#FA8A3C] hover:from-[#E8551F] hover:to-[#FF6B35] rounded-xl shadow-sm transition-all"
                >
                  <span>Apply with {tier.waiver}% Waiver</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
