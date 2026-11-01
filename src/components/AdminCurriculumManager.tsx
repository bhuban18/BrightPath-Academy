import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Video,
  FileText,
  Plus,
  Play,
  GraduationCap,
  Trash2,
  ExternalLink,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  HelpCircle,
  X
} from 'lucide-react';
import {
  ALL_COURSES_CURRICULUM,
  CourseCurriculum,
  LectureItem
} from '../data/learningCurriculum';
import { Registration } from '../lib/supabase';

interface AdminCurriculumManagerProps {
  registrations: Registration[];
  onOpenStudentPortal?: (courseId: string) => void;
}

export const AdminCurriculumManager: React.FC<AdminCurriculumManagerProps> = ({
  registrations,
  onOpenStudentPortal
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('jee-preparation');
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
  const [activeSubTab, setActiveSubTab] = useState<'lectures' | 'notes' | 'students'>('lectures');

  // Custom Lectures added by Admin (persisted to localStorage)
  const [customLectures, setCustomLectures] = useState<Record<string, LectureItem[]>>(() => {
    try {
      const saved = localStorage.getItem('brightpath_admin_custom_lectures');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modal State for adding a lecture
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Physics');
  const [newChapter, setNewChapter] = useState('');
  const [newDuration, setNewDuration] = useState('45 mins');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const currentCourse =
    ALL_COURSES_CURRICULUM.find((c) => c.id === selectedCourseId) || ALL_COURSES_CURRICULUM[0];

  // Sync selected subject if course changes and subject is not in current course
  useEffect(() => {
    if (!currentCourse.subjects.includes(selectedSubject)) {
      setSelectedSubject(currentCourse.subjects[0] || 'Physics');
    }
    setNewSubject(currentCourse.subjects[0] || 'Physics');
  }, [selectedCourseId, currentCourse]);

  // Combine default lectures with custom admin added lectures
  const allLecturesForCourse = [
    ...currentCourse.lectures,
    ...(customLectures[selectedCourseId] || [])
  ];

  const filteredLectures = allLecturesForCourse.filter(
    (lec) => lec.subject.toLowerCase() === selectedSubject.toLowerCase()
  );

  const filteredNotes = currentCourse.studyNotes.filter(
    (n) => n.subject.toLowerCase() === selectedSubject.toLowerCase()
  );

  // Filter registrations that match this course
  const enrolledStudents = registrations.filter((r) => {
    const regCourse = r.course.toLowerCase();
    const currId = currentCourse.id.toLowerCase();
    const currTitle = currentCourse.title.toLowerCase();
    return (
      regCourse.includes(currId) ||
      currTitle.includes(regCourse) ||
      (currId === 'jee-preparation' && regCourse.includes('jee')) ||
      (currId === 'neet-preparation' && regCourse.includes('neet')) ||
      (currId === 'class-11-12-science' && (regCourse.includes('11') || regCourse.includes('12'))) ||
      (currId === 'class-9-10-foundation' && (regCourse.includes('9') || regCourse.includes('10') || regCourse.includes('foundation')))
    );
  });

  const handleAddLectureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newChapter.trim()) return;

    const newLec: LectureItem = {
      id: `custom-lec-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      chapter: newChapter.trim(),
      duration: newDuration.trim() || '45 mins',
      videoUrl: newVideoUrl.trim() || 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
      thumbnailText: `${newSubject.toUpperCase()}: ${newChapter.trim()}`,
      description: newDescription.trim() || `Lecture covering key concepts of ${newChapter.trim()}.`
    };

    const updated = {
      ...customLectures,
      [selectedCourseId]: [...(customLectures[selectedCourseId] || []), newLec]
    };
    setCustomLectures(updated);
    try {
      localStorage.setItem('brightpath_admin_custom_lectures', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    // Reset & close
    setNewTitle('');
    setNewChapter('');
    setNewVideoUrl('');
    setNewDescription('');
    setIsModalOpen(false);
  };

  const handleDeleteCustomLecture = (lecId: string) => {
    const currentList = customLectures[selectedCourseId] || [];
    const updatedList = currentList.filter((l) => l.id !== lecId);
    const updated = {
      ...customLectures,
      [selectedCourseId]: updatedList
    };
    setCustomLectures(updated);
    try {
      localStorage.setItem('brightpath_admin_custom_lectures', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-150">
      {/* Course Selection Tabs */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-[#FF6B35] uppercase tracking-wider block">
              Curriculum & Learning Content Architecture
            </span>
            <h2 className="text-xl font-extrabold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
              Course Material & Student Portal Manager
            </h2>
          </div>
          {onOpenStudentPortal && (
            <button
              type="button"
              onClick={() => onOpenStudentPortal(selectedCourseId)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F1E36] hover:bg-[#1A2E4D] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              <GraduationCap className="w-4 h-4 text-[#FF6B35]" />
              <span>Preview Student Portal View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 4 Course Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-4">
          {ALL_COURSES_CURRICULUM.map((course) => {
            const isSelected = course.id === selectedCourseId;
            return (
              <button
                key={course.id}
                type="button"
                onClick={() => setSelectedCourseId(course.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0F1E36] text-white border-[#0F1E36] shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${
                    isSelected ? 'text-[#FF6B35]' : 'text-slate-500'
                  }`}
                >
                  {course.targetBadge}
                </span>
                <span className="text-xs font-bold font-['Plus_Jakarta_Sans'] line-clamp-1 block">
                  {course.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Metrics for Selected Course */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block uppercase">Total Video Lectures</span>
            <span className="text-2xl font-extrabold text-[#0F1E36] tabular-nums font-['Plus_Jakarta_Sans']">
              {allLecturesForCourse.length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF6B35]">
            <Video className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block uppercase">Study Notes & Guides</span>
            <span className="text-2xl font-extrabold text-[#0F1E36] tabular-nums font-['Plus_Jakarta_Sans']">
              {currentCourse.studyNotes.length} Chapters
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block uppercase">CBT Mock Exams</span>
            <span className="text-2xl font-extrabold text-[#0F1E36] tabular-nums font-['Plus_Jakarta_Sans']">
              {currentCourse.mockTests.length} Full Tests
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block uppercase">Registered Students</span>
            <span className="text-2xl font-extrabold text-emerald-600 tabular-nums font-['Plus_Jakarta_Sans']">
              {enrolledStudents.length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sub Tabs: Lectures vs Notes vs Students */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('lectures')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'lectures'
              ? 'bg-[#0F1E36] text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Video Lectures ({allLecturesForCourse.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('notes')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'notes'
              ? 'bg-[#0F1E36] text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Study Notes & Revision Guides</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('students')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'students'
              ? 'bg-[#0F1E36] text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Course Student Roster ({enrolledStudents.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: LECTURES */}
      {activeSubTab === 'lectures' && (
        <div className="space-y-4">
          {/* Subject Filter Bar + Add Lecture Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase mr-1">Subject:</span>
              {currentCourse.subjects.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    selectedSubject === sub
                      ? 'bg-[#FF6B35] text-white font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setNewSubject(selectedSubject);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Lecture Link</span>
            </button>
          </div>

          {/* Lectures Table / Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Lecture Title</th>
                    <th className="py-3 px-4">Subject & Chapter</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLectures.map((lec) => {
                    const isCustom = lec.id.startsWith('custom-lec-');
                    return (
                      <tr key={lec.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-[#0F1E36]">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF6B35] flex items-center justify-center shrink-0">
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </div>
                            <div>
                              <span>{lec.title}</span>
                              <p className="text-[11px] text-slate-500 font-normal line-clamp-1">
                                {lec.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-700 block">{lec.subject}</span>
                          <span className="text-[11px] text-slate-500">{lec.chapter}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">{lec.duration}</td>
                        <td className="py-3.5 px-4">
                          {isCustom ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              Admin Added
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                              Standard Core
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            {onOpenStudentPortal && (
                              <button
                                type="button"
                                onClick={() => onOpenStudentPortal(selectedCourseId)}
                                className="px-2.5 py-1 text-slate-600 hover:text-[#0F1E36] bg-slate-100 hover:bg-slate-200 rounded-md font-semibold text-[11px]"
                              >
                                View in Player
                              </button>
                            )}
                            {isCustom && (
                              <button
                                type="button"
                                onClick={() => handleDeleteCustomLecture(lec.id)}
                                className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                title="Delete Custom Lecture"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredLectures.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No video lectures found for {selectedSubject} in this course.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: STUDY NOTES & REVISION GUIDES */}
      {activeSubTab === 'notes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentCourse.studyNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                      {note.subject}
                    </span>
                    <span className="text-slate-400 font-mono">{note.pageCount} Pages</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
                    {note.chapter}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{note.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>PDF Ready</span>
                  </span>
                  {onOpenStudentPortal && (
                    <button
                      type="button"
                      onClick={() => onOpenStudentPortal(selectedCourseId)}
                      className="text-xs font-bold text-[#0F1E36] hover:text-[#FF6B35] underline"
                    >
                      Read in Portal &rarr;
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ENROLLED STUDENTS ROSTER */}
      {activeSubTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Students Registered for {currentCourse.title}
            </span>
            <span className="text-xs text-slate-500">
              Total {enrolledStudents.length} candidate(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Contact (Email & Phone)</th>
                  <th className="py-3 px-4">Batch Timing</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Portal Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrolledStudents.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-bold text-[#0F1E36]">
                      {reg.student_name}
                      <span className="block font-mono text-[10px] text-slate-400 font-normal">
                        #BP-{reg.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-800 block font-mono">{reg.email}</span>
                      <span className="text-slate-500 font-mono text-[11px]">+91 {reg.phone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{reg.batch_preference}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {reg.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {onOpenStudentPortal && (
                        <button
                          type="button"
                          onClick={() => onOpenStudentPortal(selectedCourseId)}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-[#0F1E36] hover:bg-[#1A2E4D] rounded-lg transition-colors"
                        >
                          Launch Portal
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {enrolledStudents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No registrations recorded yet for {currentCourse.title}. Submit a demo registration on the homepage to see it appear here!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW LECTURE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-left space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#FF6B35]" />
                <h3 className="text-base font-bold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
                  Add Video Lecture to {currentCourse.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLectureSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Lecture Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterclass: Thermodynamics & Heat Transfer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F1E36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F1E36] bg-white"
                  >
                    {currentCourse.subjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50 mins"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F1E36]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Chapter / Topic Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thermal Physics & Carnot Engines"
                  value={newChapter}
                  onChange={(e) => setNewChapter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F1E36]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Video URL (YouTube or Direct Embed)
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=kJQP7kiw5Fk"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F1E36]"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Leave blank to use verified educational demo stream.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Brief Lecture Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Key concepts, derivation steps, and previous year problems analyzed."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F1E36]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
                >
                  Add Video Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
