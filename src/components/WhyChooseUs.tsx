import React from 'react';
import { Lightbulb, HelpCircle, CalendarCheck, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';

interface WhyChooseUsProps {
  onEnquireClick: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onEnquireClick }) => {
  const iconMap: Record<string, React.ElementType> = {
    Lightbulb,
    HelpCircle,
    CalendarCheck,
    UsersCheck: Users,
  };

  return (
    <section id="why-us" className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B35] mb-2">
            <span>The BrightPath Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F1E36] tracking-tight font-['Plus_Jakarta_Sans']">
            Why Discerning Parents & Students Choose Us
          </h2>
          <p className="text-slate-600 text-base mt-3 leading-relaxed">
            Our pedagogical approach is engineered around four non-negotiable pillars that turn high ambition into predictable academic outcomes.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACADEMY_CONFIG.whyChooseUs.map((pillar, idx) => {
            const Icon = iconMap[pillar.icon] || Lightbulb;
            return (
              <div
                key={idx}
                className="academic-card p-6 flex flex-col justify-between text-left group"
              >
                <div>
                  {/* Top Icon and Stat */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#0F1E36] text-white flex items-center justify-center group-hover:bg-[#FF6B35] transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {pillar.stat}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#0F1E36] font-['Plus_Jakarta_Sans'] group-hover:text-[#FF6B35] transition-colors">
                    {pillar.title}
                  </h3>

                  {/* Short highlight */}
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    {pillar.shortDesc}
                  </p>

                  {/* Full description */}
                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                    {pillar.fullDesc}
                  </p>
                </div>

                {/* Sub checkmark */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-emerald-700">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Verified Classroom Standard</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Callout: BrightPath vs Traditional Mass Coaching */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
              How We Differ From Mass Coaching Factories
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Quality over quantity: why smaller batches lead to higher percentile conversion
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-red-50/50 border border-red-100">
              <span className="font-bold text-red-800 block mb-2 uppercase tracking-wide">
                Mass Coaching Chains
              </span>
              <ul className="space-y-1.5 text-slate-600">
                <li>• 120–200 students packed in a single hall</li>
                <li>• Faculty inaccessible once lecture ends</li>
                <li>• One-size-fits-all fast pace leaves doubters behind</li>
                <li>• Heavy commercial pressure and high anxiety</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="font-bold text-emerald-800 block mb-2 uppercase tracking-wide">
                BrightPath Academy
              </span>
              <ul className="space-y-1.5 text-slate-700 font-medium">
                <li>✓ Strictly capped at 25 students per batch</li>
                <li>✓ Daily 1-on-1 faculty doubt clearing clinics</li>
                <li>✓ Pace calibrated to batch mastery before advancing</li>
                <li>✓ Supportive environment with constant encouragement</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onEnquireClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0F1E36] hover:bg-[#1A2E4D] rounded-xl transition-colors shadow-xs"
            >
              <span>Experience the Difference — Book a Trial Class</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
