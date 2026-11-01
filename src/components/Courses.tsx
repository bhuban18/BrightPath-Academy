import React, { useState } from 'react';
import { ArrowRight, BookOpen, Clock, Users, Check, Sparkles } from 'lucide-react';
import { ACADEMY_CONFIG, CourseDetail } from '../config/academyConfig';
import { CourseModal } from './CourseModal';

interface CoursesProps {
  onSelectCourseForEnquiry: (courseTitle: string) => void;
  onWhatsAppForCourse: (courseTitle: string) => void;
}

export const Courses: React.FC<CoursesProps> = ({
  onSelectCourseForEnquiry,
  onWhatsAppForCourse,
}) => {
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<CourseDetail | null>(null);
  const [filterStream, setFilterStream] = useState<string>('All');

  const filterOptions = ['All', 'Foundation', 'Science', 'Engineering', 'Medical'];

  const filteredCourses = filterStream === 'All'
    ? ACADEMY_CONFIG.courses
    : ACADEMY_CONFIG.courses.filter(c => c.stream === filterStream);

  const handleLearnMore = (course: CourseDetail) => {
    setSelectedCourseForModal(course);
  };

  const handleEnquireFromModal = (courseTitle: string) => {
    setSelectedCourseForModal(null);
    onSelectCourseForEnquiry(courseTitle);
  };

  const handleWhatsAppFromModal = (courseTitle: string) => {
    setSelectedCourseForModal(null);
    onWhatsAppForCourse(courseTitle);
  };

  return (
    <section id="courses" className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B35] mb-2">
            <span>Academic Programs 2026–27</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F1E36] tracking-tight font-['Plus_Jakarta_Sans']">
            Comprehensive Courses for Every Academic Goal
          </h2>
          <p className="text-slate-600 text-base mt-3 leading-relaxed">
            Curated curriculum designed by experienced educators to ensure balanced board mastery alongside competitive edge in JEE and NEET.
          </p>

          {/* Interactive Stream Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-8 p-1.5 bg-slate-200/70 rounded-xl max-w-md mx-auto">
            {filterOptions.map((stream) => (
              <button
                key={stream}
                type="button"
                onClick={() => setFilterStream(stream)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 ${
                  filterStream === stream
                    ? 'bg-white text-[#0F1E36] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                {stream === 'All' ? 'All Courses (4)' : stream}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Required Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="academic-card flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B35] bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100">
                    {course.tag}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {course.duration}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#0F1E36] group-hover:text-[#FF6B35] transition-colors font-['Plus_Jakarta_Sans']">
                  {course.title}
                </h3>

                <p className="text-xs font-medium text-slate-500 mt-1">
                  {course.subtitle}
                </p>

                <p className="text-slate-600 text-sm mt-4 leading-relaxed line-clamp-3">
                  {course.shortDescription}
                </p>

                {/* Suitable Audience Callout */}
                <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Suitable For
                  </span>
                  <span className="text-xs font-medium text-slate-800 leading-normal block">
                    {course.targetAudience}
                  </span>
                </div>

                {/* Key feature bullets */}
                <div className="mt-5 space-y-2 text-xs text-slate-700">
                  {course.syllabusHighlights.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer with Working Action Buttons */}
              <div className="p-5 sm:p-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleLearnMore(course)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0F1E36] hover:text-[#FF6B35] bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                  aria-label={`Learn more about ${course.title}`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#FF6B35]" />
                  <span>Learn More</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectCourseForEnquiry(course.title)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#FF6B35] to-[#FA8A3C] hover:from-[#E8551F] hover:to-[#FF6B35] rounded-lg shadow-xs hover:shadow transition-all"
                  aria-label={`Enquire for ${course.title}`}
                >
                  <span>Enquire Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Free Consultation Callout */}
        <div className="mt-14 max-w-3xl mx-auto p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-base font-bold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
              Not sure which course is right for your child?
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Speak directly with our senior academic counselor for a free 15-minute diagnostic session.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectCourseForEnquiry('Free Academic Counseling')}
            className="px-4 py-2 text-xs font-semibold text-[#0F1E36] bg-slate-100 hover:bg-slate-200 rounded-lg whitespace-nowrap transition-colors"
          >
            Request Counseling Call
          </button>
        </div>
      </div>

      {/* Render Course Detail Modal */}
      <CourseModal
        course={selectedCourseForModal}
        onClose={() => setSelectedCourseForModal(null)}
        onEnquireCourse={handleEnquireFromModal}
        onWhatsAppCourse={handleWhatsAppFromModal}
      />
    </section>
  );
};
