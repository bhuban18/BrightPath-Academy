import React from 'react';
import { Award, BookOpen, Users, TrendingUp, Info } from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';

export const TrustStats: React.FC = () => {
  const stats = [
    {
      value: ACADEMY_CONFIG.statistics.teachingExperienceYears,
      label: 'Teaching Experience',
      sublabel: 'Dedicated coaching legacy',
      icon: Award,
      accent: 'text-[#0F1E36]',
      bg: 'bg-blue-50'
    },
    {
      value: ACADEMY_CONFIG.statistics.coursesOfferedCount,
      label: 'Specialised Programs',
      sublabel: 'Foundation, JEE, NEET & Boards',
      icon: BookOpen,
      accent: 'text-[#FF6B35]',
      bg: 'bg-orange-50'
    },
    {
      value: ACADEMY_CONFIG.statistics.studentsMentoredCount,
      label: 'Students Mentored',
      sublabel: 'Small batch guidance',
      icon: Users,
      accent: 'text-emerald-700',
      bg: 'bg-emerald-50'
    },
    {
      value: ACADEMY_CONFIG.statistics.successRate,
      label: 'Academic Success',
      sublabel: 'Board & competitive qualifications',
      icon: TrendingUp,
      accent: 'text-indigo-700',
      bg: 'bg-indigo-50'
    }
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sample Demonstration Notice (Mandatory Requirement) */}
        <div className="mb-6 flex items-center justify-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-md text-[11px] font-medium text-amber-900">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              <strong>Note:</strong> {ACADEMY_CONFIG.statistics.disclaimer}
            </span>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex flex-col text-left transition-all hover:border-slate-200 hover:shadow-xs"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.accent}`} />
                  </div>
                </div>

                <div className="text-3xl sm:text-4xl font-extrabold text-[#0F1E36] tracking-tight tabular-nums font-['Plus_Jakarta_Sans']">
                  {stat.value}
                </div>

                <div className="text-sm font-bold text-slate-800 mt-1">
                  {stat.label}
                </div>

                <div className="text-xs text-slate-500 mt-0.5">
                  {stat.sublabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
