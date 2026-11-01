import React from 'react';
import { Star, Quote, MessageSquareQuote, Info } from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B35] mb-2">
            <span>Student & Parent Voice</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F1E36] tracking-tight font-['Plus_Jakarta_Sans']">
            What Our Students and Parents Say
          </h2>
          <p className="text-slate-600 text-base mt-3 leading-relaxed">
            Real feedback on how our mentoring, doubt sessions, and balanced approach helped students overcome academic hurdles.
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-md text-[11px] text-slate-600">
            <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Sample demonstration reviews — can be replaced with genuine testimonials from your students.</span>
          </div>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ACADEMY_CONFIG.testimonials.map((item) => (
            <div
              key={item.id}
              className="academic-card p-6 sm:p-7 flex flex-col justify-between text-left relative"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Highlight line */}
                <p className="text-sm font-bold text-[#0F1E36] mb-3">
                  "{item.highlight}"
                </p>

                {/* Full quote */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{item.content}"
                </p>
              </div>

              {/* Author footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0F1E36]">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.role}
                  </p>
                </div>

                <span className="text-[11px] font-semibold text-[#FF6B35] bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                  {item.program}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
