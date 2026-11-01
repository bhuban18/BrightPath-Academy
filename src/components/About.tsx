import React from 'react';
import { Award, BookCheck, CheckCircle2, GraduationCap, Quote, Sparkles, UserCheck } from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';

export const About: React.FC = () => {
  const { director, philosophy } = ACADEMY_CONFIG;

  return (
    <section id="about" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B35] mb-2">
            <span>About BrightPath Academy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F1E36] tracking-tight font-['Plus_Jakarta_Sans']">
            Mentoring Minds. Nurturing Scientific Excellence.
          </h2>
          <p className="text-slate-600 text-base mt-3 leading-relaxed">
            Founded with the conviction that true academic coaching is not about rote memorisation, but about igniting genuine conceptual curiosity and methodical discipline.
          </p>
        </div>

        {/* 2-Column Split: Institute Story & Classroom Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-6 text-left">
            <h3 className="text-2xl font-bold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
              A Classroom Where Every Question is Welcomed
            </h3>
            
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              At BrightPath Academy, we believe every student possesses the innate capacity to master advanced Mathematics and Sciences when taught with patient, step-by-step logic.
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Unlike industrial coaching chains with 150+ students crammed into auditoriums, we restrict our batches to just 25 students. This allows our faculty to understand each child's learning speed, eliminate anxiety, and turn academic stress into self-driven accomplishment.
            </p>

            {/* Teaching Philosophy Points */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Our Core Teaching Philosophy
              </h4>
              {philosophy.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-[#F8FAFC] rounded-xl border border-slate-100 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-sm font-bold text-[#0F1E36]">{item.heading}</h5>
                    <p className="text-xs text-slate-600 mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-lg">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100 aspect-[4/3]">
                <img
                  src="/src/assets/images/brightpath_classroom_session_1793551303265.jpg"
                  alt="Interactive seminar class at BrightPath Academy with teacher explaining concepts"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              {/* Caption pill */}
              <div className="mt-3 p-3 bg-[#F8FAFC] rounded-xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-[#0F1E36]">Active Classroom Learning Session</span>
                <span className="text-emerald-700 font-medium">Daily Mentorship</span>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher / Founder Profile Section */}
        <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/90 p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Director Portrait (4 cols) */}
            <div className="lg:col-span-4">
              <div className="relative mx-auto max-w-xs rounded-2xl overflow-hidden shadow-md border border-slate-200 aspect-[4/5] bg-slate-200">
                <img
                  src="/src/assets/images/brightpath_faculty_director_1793551302790.jpg"
                  alt={director.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Director Bio & Qualifications (8 cols) */}
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <GraduationCap className="w-4 h-4 text-[#FF6B35]" />
                <span>Academic Leadership & Faculty Profile</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
                  {director.name}
                </h3>
                <p className="text-sm font-semibold text-[#FF6B35] mt-0.5">
                  {director.role}
                </p>
              </div>

              {/* Editable Qualifications and Experience Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200/70">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Qualifications
                  </span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                    {director.qualifications}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/70">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Coaching Experience
                  </span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                    {director.experience}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-slate-600 text-sm leading-relaxed">
                {director.aboutBio}
              </p>

              {/* Quote block */}
              <div className="p-4 bg-white rounded-xl border border-slate-200/80 relative">
                <Quote className="w-5 h-5 text-[#FF6B35]/40 absolute top-3 right-3" />
                <p className="text-xs sm:text-sm italic text-slate-700 leading-relaxed pr-6">
                  "{director.quote}"
                </p>
                <span className="block text-right text-[11px] font-bold text-[#0F1E36] mt-2">
                  — {director.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
