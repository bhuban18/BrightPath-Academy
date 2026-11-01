import React from 'react';
import { X, CheckCircle2, Clock, Users, Calendar, ArrowRight, MessageSquare, BookOpen } from 'lucide-react';
import { CourseDetail, ACADEMY_CONFIG } from '../config/academyConfig';

interface CourseModalProps {
  course: CourseDetail | null;
  onClose: () => void;
  onEnquireCourse: (courseTitle: string) => void;
  onWhatsAppCourse: (courseTitle: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  onClose,
  onEnquireCourse,
  onWhatsAppCourse
}) => {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-course-title"
      >
        {/* Header with Dark Navy accent */}
        <div className="bg-[#0F1E36] text-white p-6 sm:p-7 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close course details"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FF6B35] text-white uppercase tracking-wider mb-2">
            {course.tag}
          </div>

          <h2 id="modal-course-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans']">
            {course.title}
          </h2>

          <p className="text-slate-300 text-sm mt-1">
            {course.subtitle}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Overview */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Course Overview & Philosophy
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              {course.detailedDescription}
            </p>
          </div>

          {/* Quick Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#F8FAFC] rounded-xl border border-slate-100 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF6B35] shrink-0" />
              <div>
                <span className="block font-bold text-slate-900">Duration</span>
                <span>{course.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#FF6B35] shrink-0" />
              <div>
                <span className="block font-bold text-slate-900">Batch Size</span>
                <span>{course.batchSize}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#FF6B35] shrink-0" />
              <div>
                <span className="block font-bold text-slate-900">Assessments</span>
                <span>{course.testFrequency}</span>
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Suitable Audience
            </h3>
            <p className="text-sm font-medium text-slate-800 bg-amber-50/60 p-3 rounded-lg border border-amber-200/60">
              {course.targetAudience}
            </p>
          </div>

          {/* Syllabus & Curriculum Highlights */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Curriculum & Coverage Highlights
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              {course.syllabusHighlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Pedagogical Features */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Included Benefits & Support
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              {course.keyFeatures.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F1E36] mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onWhatsAppCourse(course.title)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Enquire on WhatsApp</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onEnquireCourse(course.title)}
              className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#FF6B35] to-[#FA8A3C] hover:from-[#E8551F] hover:to-[#FF6B35] rounded-xl shadow-sm"
            >
              <span>Enrol / Enquire Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
