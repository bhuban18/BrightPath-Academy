import React from 'react';
import { Trophy, Award, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';

export const Results: React.FC = () => {
  return (
    <section id="results" className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B35] mb-2">
            <span>Student Milestones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F1E36] tracking-tight font-['Plus_Jakarta_Sans']">
            Proven Track Record of Excellence
          </h2>
          <p className="text-slate-600 text-base mt-3 leading-relaxed">
            Consistent preparation, targeted test series, and constant doubt support empower our students to qualify top national colleges.
          </p>

          {/* Mandatory Clear Sample Demonstration Disclaimer */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Demonstration Showcase:</strong> The ranks and names below are illustrative sample records provided for freelance website presentation. Replace with your institute’s actual results.
            </span>
          </div>
        </div>

        {/* Results Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACADEMY_CONFIG.sampleResults.map((result, idx) => (
            <div
              key={idx}
              className="academic-card p-6 flex flex-col justify-between text-left group relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0F1E36] to-[#FF6B35]" />

              <div>
                {/* Exam pill */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-[#0F1E36] bg-slate-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {result.exam}
                  </span>
                  <Trophy className="w-4 h-4 text-amber-500" />
                </div>

                {/* Score / Rank Highlight */}
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0F1E36] tracking-tight font-['Plus_Jakarta_Sans'] group-hover:text-[#FF6B35] transition-colors">
                  {result.rank}
                </div>

                {/* Student Name */}
                <h3 className="text-base font-bold text-slate-800 mt-2">
                  {result.name}
                </h3>

                {/* Program */}
                <p className="text-xs text-slate-500 mt-0.5">
                  {result.program}
                </p>

                {/* Score Details */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-400">Score Metric:</span>
                    <span className="font-semibold text-emerald-700">{result.scoreDetail}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-400">Board Record:</span>
                    <span className="font-semibold text-slate-900">{result.boardScore}</span>
                  </div>
                </div>
              </div>

              {/* Sample Tag */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verified Selection</span>
                <span className="text-amber-700 font-medium">Sample Data</span>
              </div>
            </div>
          ))}
        </div>

        {/* Hall of Fame Highlights Strip */}
        <div className="mt-12 p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-2">
            <div className="text-2xl font-black text-[#0F1E36] font-['Plus_Jakarta_Sans']">
              100/100
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Perfect Scores in Math & Physics</div>
          </div>
          <div className="p-2">
            <div className="text-2xl font-black text-[#0F1E36] font-['Plus_Jakarta_Sans']">
              95%+
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Board Aggregate across 42 Students</div>
          </div>
          <div className="p-2">
            <div className="text-2xl font-black text-[#0F1E36] font-['Plus_Jakarta_Sans']">
              AIR Top 500
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Selections in JEE Adv & NEET</div>
          </div>
          <div className="p-2">
            <div className="text-2xl font-black text-[#0F1E36] font-['Plus_Jakarta_Sans']">
              100%
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Transparent Result Verification</div>
          </div>
        </div>
      </div>
    </section>
  );
};
