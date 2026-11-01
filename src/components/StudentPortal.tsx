import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Video,
  FileText,
  CheckSquare,
  HelpCircle,
  TrendingUp,
  LogOut,
  ArrowLeft,
  Play,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Download,
  AlertCircle,
  FileCode,
  RotateCcw,
  Eye,
  X,
  Lock,
  ChevronDown,
  Layers
} from 'lucide-react';
import {
  StudentSession,
  getStudentSession,
  saveStudentSession,
  logoutStudent,
  loginDemoStudent,
  toggleLectureWatched,
  toggleRevisionItem,
  recordMockTestSubmission
} from '../lib/studentAuth';
import {
  COURSE_CURRICULUM_DATA,
  VideoLecture,
  StudyNote,
  FormulaSheet,
  PracticeQuestion,
  MockTest,
  CourseCurriculum
} from '../data/learningCurriculum';
import { ACADEMY_CONFIG } from '../config/academyConfig';

interface StudentPortalProps {
  onBackToWebsite: () => void;
  initialCourseId?: string;
}

type TabType = 'overview' | 'lectures' | 'notes' | 'guides' | 'tests' | 'progress';

export const StudentPortal: React.FC<StudentPortalProps> = ({
  onBackToWebsite,
  initialCourseId
}) => {
  const [session, setSession] = useState<StudentSession | null>(null);
  const [activeCourseId, setActiveCourseId] = useState<string>('jee-preparation');
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Video Player Modal State
  const [activeVideo, setActiveVideo] = useState<VideoLecture | null>(null);

  // Study Note Modal State
  const [activeNote, setActiveNote] = useState<StudyNote | null>(null);

  // Subject Filter within current course (e.g. 'All' | 'Physics' | 'Chemistry' | 'Mathematics')
  const [subjectFilter, setSubjectFilter] = useState<string>('All');

  // Mock Test Taking State
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);
  const [testResultSummary, setTestResultSummary] = useState<{
    score: number;
    total: number;
    correct: number;
    incorrect: number;
    unanswered: number;
    percentage: number;
  } | null>(null);

  // Load or initialize student session
  useEffect(() => {
    let currentSession = getStudentSession();
    if (!currentSession) {
      // Auto initialize demo session with requested course
      currentSession = loginDemoStudent(initialCourseId || 'jee-preparation');
    }

    setSession(currentSession);

    // Pick active course
    const targetCourse = initialCourseId || currentSession.lastActiveCourseId || currentSession.enrolledCourses[0] || 'jee-preparation';
    setActiveCourseId(targetCourse);
  }, [initialCourseId]);

  // Current course curriculum
  const currentCurriculum: CourseCurriculum | undefined = COURSE_CURRICULUM_DATA[activeCourseId];

  // Check if student is enrolled in current active course
  const isEnrolledInActiveCourse = session?.enrolledCourses.includes(activeCourseId);

  // Handle enrolling into a course
  const handleEnrollInCourse = (courseId: string) => {
    if (!session) return;
    const updatedCourses = Array.from(new Set([...session.enrolledCourses, courseId]));
    const updated = {
      ...session,
      enrolledCourses: updatedCourses,
      lastActiveCourseId: courseId
    };
    saveStudentSession(updated);
    setSession(updated);
    setActiveCourseId(courseId);
  };

  // Toggle Lecture Watched
  const handleToggleLecture = (lectureId: string) => {
    toggleLectureWatched(lectureId);
    setSession(getStudentSession());
  };

  // Toggle Checklist Item
  const handleToggleChecklist = (itemId: string) => {
    toggleRevisionItem(itemId);
    setSession(getStudentSession());
  };

  // Start a Mock Test
  const handleStartTest = (test: MockTest) => {
    setActiveTest(test);
    setUserAnswers({});
    setTestSubmitted(false);
    setTestResultSummary(null);
  };

  // Select option in test
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (testSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  // Submit test
  const handleSubmitTest = () => {
    if (!activeTest) return;

    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    activeTest.questions.forEach(q => {
      const selected = userAnswers[q.id];
      if (selected === undefined) {
        unanswered++;
      } else if (selected === q.correctOptionIndex) {
        correct++;
        score += 4; // +4 for JEE
      } else {
        incorrect++;
        score -= 1; // -1 for JEE
      }
    });

    const maxScore = activeTest.questions.length * 4;
    const finalScore = Math.max(0, score);
    const percentage = Math.round((finalScore / maxScore) * 100 * 10) / 10;

    const summary = {
      score: finalScore,
      total: maxScore,
      correct,
      incorrect,
      unanswered,
      percentage
    };

    setTestResultSummary(summary);
    setTestSubmitted(true);

    // Record to student session history
    recordMockTestSubmission(activeTest.id, activeTest.title, activeCourseId, finalScore, maxScore);
    setSession(getStudentSession());
  };

  // Logout handler
  const handleLogout = () => {
    logoutStudent();
    onBackToWebsite();
  };

  if (!session || !currentCurriculum) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#0F1E36] border-t-[#FF6B35] rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate Course Progress
  const totalCourseLectures = currentCurriculum.lectures.length;
  const completedCourseLectures = currentCurriculum.lectures.filter(l =>
    session.completedLectures.includes(l.id)
  ).length;
  const lectureProgressPercent = totalCourseLectures > 0
    ? Math.round((completedCourseLectures / totalCourseLectures) * 100)
    : 0;

  const totalChecklist = currentCurriculum.revisionChecklist.length;
  const completedChecklist = currentCurriculum.revisionChecklist.filter(c =>
    session.checklistCompleted.includes(c.id)
  ).length;
  const checklistPercent = totalChecklist > 0
    ? Math.round((completedChecklist / totalChecklist) * 100)
    : 0;

  // Filtered lectures and notes by subject
  const filteredLectures = subjectFilter === 'All'
    ? currentCurriculum.lectures
    : currentCurriculum.lectures.filter(l => l.subject === subjectFilter);

  const filteredNotes = subjectFilter === 'All'
    ? currentCurriculum.notes
    : currentCurriculum.notes.filter(n => n.subject === subjectFilter);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#191C1E] flex flex-col font-['Inter'] text-left">
      {/* Top Learning Navigation Bar */}
      <header className="bg-[#0F1E36] text-white py-3.5 px-4 sm:px-8 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Brand & Student Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5 text-[#FF6B35]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base font-['Plus_Jakarta_Sans']">
                  {ACADEMY_CONFIG.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF6B35] text-white uppercase tracking-wider">
                  Student Portal
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Welcome, <strong className="text-white">{session.name}</strong> ({session.email})
              </p>
            </div>
          </div>

          {/* Quick Course Switcher & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <select
                value={activeCourseId}
                onChange={(e) => {
                  setActiveCourseId(e.target.value);
                  setSubjectFilter('All');
                }}
                className="bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 focus:outline-none cursor-pointer pr-7"
              >
                {Object.values(COURSE_CURRICULUM_DATA).map(c => (
                  <option key={c.courseId} value={c.courseId} className="bg-slate-900 text-white">
                    {c.courseTitle} {session.enrolledCourses.includes(c.courseId) ? '(Enrolled)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={onBackToWebsite}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600/80 hover:bg-red-600 text-white transition-colors flex items-center gap-1"
              title="End session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Demo Session Notice Pill */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-1.5 px-4 text-center text-xs text-amber-900">
        <span className="font-bold text-amber-800">Student Learning Mode:</span> Course materials, lectures, and mock test scores are saved in your browser session. Connect Supabase to enable cross-device cloud sync.
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs mb-6 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {[
              { id: 'overview', label: 'My Courses & Overview', icon: BookOpen },
              { id: 'lectures', label: `Video Lectures (${currentCurriculum.lectures.length})`, icon: Video },
              { id: 'notes', label: `Study Notes (${currentCurriculum.notes.length})`, icon: FileText },
              { id: 'guides', label: 'Formula Sheets & Revision', icon: CheckSquare },
              { id: 'tests', label: `Practice & Mock Tests (${currentCurriculum.mockTests.length})`, icon: HelpCircle },
              { id: 'progress', label: 'My Progress Tracking', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#0F1E36] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF6B35]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Enrollment Verification Guard */}
        {!isEnrolledInActiveCourse ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-2xl mx-auto space-y-4 my-10 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
              Enrollment Required for {currentCurriculum.courseTitle}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              You are currently enrolled in:{' '}
              <strong className="text-[#0F1E36]">
                {session.enrolledCourses.join(', ')}
              </strong>
              . To access the lectures, study guides, and mock tests for this course, please activate enrollment below.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleEnrollInCourse(activeCourseId)}
                className="px-6 py-3 text-xs font-bold text-white bg-gradient-to-r from-[#FF6B35] to-[#FA8A3C] rounded-xl shadow-sm hover:shadow"
              >
                Enrol in {currentCurriculum.courseTitle} Now
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* TAB 1: OVERVIEW & MY COURSES */
          /* ============================================================== */
          activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Hero Banner for Active Course */}
              <div className="bg-gradient-to-br from-[#0F1E36] to-[#1A2E4D] text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6B35]/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF6B35] text-white uppercase tracking-wider">
                      {currentCurriculum.stream} · {currentCurriculum.targetExam}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight">
                      {currentCurriculum.courseTitle} Learning Portal
                    </h1>
                    <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                      Structured curriculum designed by Dr. Rajesh K. Varma and senior academic mentors. Access concept lectures, curated formulas, and CBT mock tests.
                    </p>
                  </div>

                  <div className="p-4 bg-white/10 rounded-xl border border-white/10 backdrop-blur-xs text-center shrink-0">
                    <span className="text-xs text-slate-300 block">Course Completion</span>
                    <span className="text-3xl font-black text-[#FF6B35] font-['Plus_Jakarta_Sans'] tabular-nums">
                      {lectureProgressPercent}%
                    </span>
                    <span className="text-[11px] text-slate-300 block mt-0.5">
                      {completedCourseLectures} of {totalCourseLectures} Lectures Watched
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Links & My Enrolled Courses Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Enrolled Courses Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-sm text-[#0F1E36] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#FF6B35]" />
                      <span>My Enrolled Programs</span>
                    </h3>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {session.enrolledCourses.length} Active
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {session.enrolledCourses.map(cId => {
                      const cData = COURSE_CURRICULUM_DATA[cId];
                      const isSelected = activeCourseId === cId;
                      return (
                        <div
                          key={cId}
                          onClick={() => setActiveCourseId(cId)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-slate-50 border-[#0F1E36] ring-1 ring-[#0F1E36]'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-xs text-[#0F1E36] block">
                              {cData?.courseTitle || cId}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {cData?.subjects.join(' · ')}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Continue Learning Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-sm text-[#0F1E36] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                      <Play className="w-4 h-4 text-emerald-600" />
                      <span>Next Recommended Lecture</span>
                    </h3>
                  </div>

                  {currentCurriculum.lectures[0] ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35] block">
                          {currentCurriculum.lectures[0].subject} · {currentCurriculum.lectures[0].chapter}
                        </span>
                        <h4 className="font-bold text-xs text-[#0F1E36] mt-1">
                          {currentCurriculum.lectures[0].title}
                        </h4>
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          Duration: {currentCurriculum.lectures[0].duration} · Instructor: {currentCurriculum.lectures[0].instructor}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveVideo(currentCurriculum.lectures[0])}
                        className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#0F1E36] hover:bg-[#1A2E4D] rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5 text-[#FF6B35]" />
                        <span>Watch Lecture Now</span>
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No lectures scheduled yet.</p>
                  )}
                </div>

                {/* Diagnostic Test Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-sm text-[#0F1E36] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Online CBT Practice Exam</span>
                    </h3>
                  </div>

                  {currentCurriculum.mockTests[0] ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                          {currentCurriculum.mockTests[0].title}
                        </span>
                        <div className="flex items-center justify-between text-xs text-slate-700 mt-2 font-medium">
                          <span>{currentCurriculum.mockTests[0].questions.length} Questions</span>
                          <span>{currentCurriculum.mockTests[0].durationMinutes} Mins</span>
                          <span className="font-bold text-emerald-700">+{currentCurriculum.mockTests[0].totalMarks} Marks</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('tests');
                          handleStartTest(currentCurriculum.mockTests[0]);
                        }}
                        className="w-full py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-[#FF6B35] to-[#FA8A3C] rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Launch Mock Test</span>
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No mock tests available for this program.</p>
                  )}
                </div>
              </div>
            </div>
          ) ||

          /* ============================================================== */
          /* TAB 2: VIDEO LECTURES */
          /* ============================================================== */
          activeTab === 'lectures' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Header & Subject Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h2 className="text-lg font-bold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
                    Video Lectures & Concept Masterclasses
                  </h2>
                  <p className="text-xs text-slate-500">
                    Interactive classroom recordings with chapter breakdown and in-depth derivations.
                  </p>
                </div>

                {/* Subject Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {['All', ...currentCurriculum.subjects].map(subj => (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => setSubjectFilter(subj)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                        subjectFilter === subj
                          ? 'bg-[#0F1E36] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lectures Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLectures.map(lecture => {
                  const isWatched = session.completedLectures.includes(lecture.id);
                  return (
                    <div
                      key={lecture.id}
                      className="academic-card p-5 flex flex-col justify-between overflow-hidden group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35] bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                            {lecture.subject}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{lecture.duration}</span>
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 block">
                            {lecture.chapter}
                          </span>
                          <h3 className="text-base font-bold text-[#0F1E36] group-hover:text-[#FF6B35] transition-colors mt-0.5 line-clamp-2">
                            {lecture.title}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {lecture.summary}
                        </p>

                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-[11px] text-slate-500">Instructor: </span>
                          <span className="text-[11px] font-bold text-slate-700">{lecture.instructor}</span>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveVideo(lecture)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#0F1E36] hover:bg-[#1A2E4D] rounded-xl shadow-xs"
                        >
                          <Play className="w-3.5 h-3.5 text-[#FF6B35]" />
                          <span>Watch Lecture</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleLecture(lecture.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                            isWatched
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isWatched ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span>{isWatched ? 'Completed' : 'Mark Done'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) ||

          /* ============================================================== */
          /* TAB 3: STUDY NOTES */
          /* ============================================================== */
          activeTab === 'notes' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h2 className="text-lg font-bold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
                    Subject & Chapter Study Notes
                  </h2>
                  <p className="text-xs text-slate-500">
                    Comprehensive theory sheets with key derivation summaries and exam highlights.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {['All', ...currentCurriculum.subjects].map(subj => (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => setSubjectFilter(subj)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                        subjectFilter === subj
                          ? 'bg-[#0F1E36] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredNotes.map(note => (
                  <div
                    key={note.id}
                    className="academic-card p-6 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35] bg-orange-50 px-2.5 py-0.5 rounded border border-orange-100">
                          {note.subject} · {note.chapter}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {note.readTime}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#0F1E36]">
                        {note.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {note.summary}
                      </p>

                      <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-700 block uppercase">
                          Key Exam Focus Points
                        </span>
                        <ul className="space-y-1 text-xs text-slate-600">
                          {note.keyPoints.map((pt, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-[#FF6B35] font-bold">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveNote(note)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#0F1E36] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#0F1E36]" />
                        <span>Read Online Note</span>
                      </button>

                      {note.fileAvailable ? (
                        <button
                          type="button"
                          onClick={() => setActiveNote(note)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-600" />
                          <span>PDF Available</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                          Drafting by Faculty
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) ||

          /* ============================================================== */
          /* TAB 4: STUDY GUIDES & FORMULA SHEETS */
          /* ============================================================== */
          activeTab === 'guides' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              {/* Revision Checklist Section */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#0F1E36] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-[#FF6B35]" />
                      <span>{currentCurriculum.courseTitle} Revision Checklist</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Check off topics as you finish textbook reading, derivation practice, and past 10-year papers.
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Checklist Completed</span>
                    <span className="text-xl font-black text-emerald-600 font-['Plus_Jakarta_Sans'] tabular-nums">
                      {completedChecklist} / {totalChecklist} ({checklistPercent}%)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentCurriculum.revisionChecklist.map(item => {
                    const isDone = session.checklistCompleted.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleChecklist(item.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                          isDone
                            ? 'bg-emerald-50/60 border-emerald-300 text-slate-800'
                            : 'bg-[#F8FAFC] border-slate-200 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => {}}
                          className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            {item.subject} · {item.chapter}
                          </span>
                          <span className={`text-xs font-semibold block ${isDone ? 'line-through text-slate-400' : ''}`}>
                            {item.topic}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Formula Sheets Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#0F1E36] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-[#FF6B35]" />
                    <span>Essential High-Yield Formula Banks</span>
                  </h3>
                </div>

                <div className="space-y-6">
                  {currentCurriculum.formulaSheets.map((sheet, sIdx) => (
                    <div key={sIdx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35]">
                            {sheet.subject} · {sheet.chapter}
                          </span>
                          <h4 className="text-base font-bold text-[#0F1E36] mt-0.5">
                            {sheet.title}
                          </h4>
                        </div>
                        <span className="text-xs font-bold text-slate-500">
                          {sheet.formulas.length} Formulas
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {sheet.formulas.map((f, fIdx) => (
                          <div key={fIdx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                            <span className="text-xs font-bold text-slate-800 block">
                              {f.name}
                            </span>
                            <div className="my-1.5 p-2 bg-white rounded-lg font-mono text-sm font-bold text-[#0F1E36] border border-slate-200 text-center">
                              {f.formula}
                            </div>
                            <span className="text-[11px] text-slate-500 block">
                              {f.explanation}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) ||

          /* ============================================================== */
          /* TAB 5: PRACTICE & MOCK TESTS (CBT ENGINE) */
          /* ============================================================== */
          activeTab === 'tests' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {activeTest ? (
                /* CBT TEST TAKING / RESULT VIEW */
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
                  {/* Test Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <span className="text-[11px] font-bold text-[#FF6B35] uppercase tracking-wider">
                        Computer-Based Test (CBT) Simulation
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
                        {activeTest.title}
                      </h2>
                      <span className="text-xs text-slate-500">
                        Marking Scheme: {activeTest.markingScheme}
                      </span>
                    </div>

                    {!testSubmitted ? (
                      <div className="flex items-center gap-3">
                        <div className="px-3.5 py-1.5 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs font-bold flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-red-600 animate-pulse" />
                          <span>Timed: {activeTest.durationMinutes} Minutes</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleSubmitTest}
                          className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#FF6B35] to-[#FA8A3C] rounded-xl shadow-xs"
                        >
                          Submit Test
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartTest(activeTest)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#0F1E36] bg-slate-100 hover:bg-slate-200 rounded-xl"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake Exam</span>
                      </button>
                    )}
                  </div>

                  {/* Test Result Scorecard (if submitted) */}
                  {testSubmitted && testResultSummary && (
                    <div className="p-6 bg-[#0F1E36] text-white rounded-2xl space-y-4">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <span className="text-xs uppercase font-bold text-[#FF6B35] tracking-wider">
                            Official Test Scorecard
                          </span>
                          <h3 className="text-2xl font-black font-['Plus_Jakarta_Sans']">
                            Score: {testResultSummary.score} / {testResultSummary.total} ({testResultSummary.percentage}%)
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <div className="text-center px-3 py-1.5 bg-white/10 rounded-lg">
                            <span className="block text-emerald-400 font-bold">{testResultSummary.correct}</span>
                            <span className="text-[10px] text-slate-300">Correct (+4)</span>
                          </div>
                          <div className="text-center px-3 py-1.5 bg-white/10 rounded-lg">
                            <span className="block text-red-400 font-bold">{testResultSummary.incorrect}</span>
                            <span className="text-[10px] text-slate-300">Incorrect (-1)</span>
                          </div>
                          <div className="text-center px-3 py-1.5 bg-white/10 rounded-lg">
                            <span className="block text-slate-300 font-bold">{testResultSummary.unanswered}</span>
                            <span className="text-[10px] text-slate-300">Unanswered</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300">
                        Review the detailed question-by-question explanations below to analyze your mistakes and bridge conceptual gaps.
                      </p>
                    </div>
                  )}

                  {/* Questions List */}
                  <div className="space-y-6">
                    {activeTest.questions.map((q, idx) => {
                      const selected = userAnswers[q.id];
                      const isCorrect = selected === q.correctOptionIndex;
                      const isAnswered = selected !== undefined;

                      return (
                        <div
                          key={q.id}
                          className={`p-5 rounded-xl border transition-all ${
                            testSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50/40 border-emerald-200'
                                : isAnswered
                                ? 'bg-red-50/40 border-red-200'
                                : 'bg-slate-50 border-slate-200'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                              Question {idx + 1} of {activeTest.questions.length} · {q.subject} ({q.chapter})
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                              {q.difficulty}
                            </span>
                          </div>

                          <p className="text-sm font-semibold text-[#0F1E36] mb-4">
                            {q.question}
                          </p>

                          {/* Options */}
                          <div className="space-y-2">
                            {q.options.map((opt, optIdx) => {
                              const isThisSelected = selected === optIdx;
                              const isThisCorrect = q.correctOptionIndex === optIdx;

                              let optionStyle = 'border-slate-200 hover:bg-slate-50 text-slate-700';
                              if (testSubmitted) {
                                if (isThisCorrect) {
                                  optionStyle = 'border-emerald-500 bg-emerald-100/70 text-emerald-950 font-bold';
                                } else if (isThisSelected && !isThisCorrect) {
                                  optionStyle = 'border-red-400 bg-red-100/70 text-red-950';
                                }
                              } else if (isThisSelected) {
                                optionStyle = 'border-[#0F1E36] bg-[#0F1E36] text-white font-semibold';
                              }

                              return (
                                <div
                                  key={optIdx}
                                  onClick={() => handleSelectOption(q.id, optIdx)}
                                  className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${optionStyle}`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span className="w-5 h-5 rounded-full border flex items-center justify-center font-bold text-[11px] shrink-0">
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span>{opt}</span>
                                  </div>

                                  {testSubmitted && isThisCorrect && (
                                    <span className="text-[11px] font-bold text-emerald-800">✓ Correct Answer</span>
                                  )}
                                  {testSubmitted && isThisSelected && !isThisCorrect && (
                                    <span className="text-[11px] font-bold text-red-700">✗ Your Choice</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Explanation Card (visible after submission) */}
                          {testSubmitted && (
                            <div className="mt-4 p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                              <span className="text-[11px] font-bold uppercase text-[#FF6B35] block">
                                Step-by-Step Solution & Concept:
                              </span>
                              <p className="text-xs text-slate-700 leading-relaxed">
                                {q.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!testSubmitted && (
                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={handleSubmitTest}
                        className="px-6 py-3 text-xs font-bold text-white bg-gradient-to-r from-[#FF6B35] to-[#FA8A3C] hover:from-[#E8551F] hover:to-[#FF6B35] rounded-xl shadow-md"
                      >
                        Submit Test & View Scorecard
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* MOCK TESTS LIST */
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <h2 className="text-lg font-bold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
                      Computer-Based Mock Test Series
                    </h2>
                    <p className="text-xs text-slate-500">
                      Standard NTA-pattern diagnostic exams with instant scoring and negative marking calculations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentCurriculum.mockTests.map(test => (
                      <div
                        key={test.id}
                        className="academic-card p-6 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                              CBT Simulation
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              {test.durationMinutes} Minutes
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-[#0F1E36]">
                            {test.title}
                          </h3>

                          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl text-center text-xs">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase block">Questions</span>
                              <span className="font-bold text-slate-800">{test.questions.length} MCQs</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase block">Max Marks</span>
                              <span className="font-bold text-slate-800">{test.totalMarks}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase block">Marking</span>
                              <span className="font-bold text-emerald-700">+4 / -1</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handleStartTest(test)}
                            className="w-full py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#FF6B35] to-[#FA8A3C] rounded-xl shadow-xs hover:shadow text-center"
                          >
                            Start Mock Examination
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) ||

          /* ============================================================== */
          /* TAB 6: PROGRESS TRACKING */
          /* ============================================================== */
          activeTab === 'progress' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
                    Academic Progress & Test Performance History
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Continuous tracking of lectures attended, checklist completion, and diagnostic exam scores.
                  </p>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-xs text-slate-500 block">Lectures Completed</span>
                    <span className="text-2xl font-black text-[#0F1E36] font-['Plus_Jakarta_Sans']">
                      {completedCourseLectures}
                    </span>
                    <span className="text-[11px] text-slate-400">of {totalCourseLectures} total</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-xs text-slate-500 block">Checklist Items Done</span>
                    <span className="text-2xl font-black text-emerald-600 font-['Plus_Jakarta_Sans']">
                      {completedChecklist}
                    </span>
                    <span className="text-[11px] text-slate-400">of {totalChecklist} topics</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-xs text-slate-500 block">Mock Tests Taken</span>
                    <span className="text-2xl font-black text-[#FF6B35] font-['Plus_Jakarta_Sans']">
                      {session.testHistory?.length || 0}
                    </span>
                    <span className="text-[11px] text-slate-400">Exams recorded</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-xs text-slate-500 block">Average Test Accuracy</span>
                    <span className="text-2xl font-black text-blue-600 font-['Plus_Jakarta_Sans']">
                      {session.testHistory && session.testHistory.length > 0
                        ? `${Math.round(
                            session.testHistory.reduce((acc, t) => acc + t.percentage, 0) /
                              session.testHistory.length
                          )}%`
                        : 'N/A'}
                    </span>
                    <span className="text-[11px] text-slate-400">Historical performance</span>
                  </div>
                </div>

                {/* Test History Table */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-[#0F1E36] uppercase tracking-wider">
                    Recent Test Submissions
                  </h3>

                  {session.testHistory && session.testHistory.length > 0 ? (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-3">Test Title</th>
                            <th className="p-3">Score</th>
                            <th className="p-3">Percentage</th>
                            <th className="p-3">Submitted Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {session.testHistory.map((th, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-3 font-semibold text-slate-800">{th.testTitle}</td>
                              <td className="p-3 font-mono font-bold text-emerald-700">
                                {th.score} / {th.totalMarks}
                              </td>
                              <td className="p-3 font-bold text-slate-900">{th.percentage}%</td>
                              <td className="p-3 text-slate-500">
                                {new Date(th.submittedAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-400 border border-slate-200">
                      No mock tests taken yet. Launch the diagnostic mock test from the Practice & Mock Tests tab.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#0F1E36] text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35]">
                  {activeVideo.subject} · {activeVideo.chapter}
                </span>
                <h3 className="text-base font-bold font-['Plus_Jakarta_Sans'] line-clamp-1">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Frame */}
            <div className="aspect-video bg-black relative">
              <iframe
                src={activeVideo.videoUrl}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Details & Action Footer */}
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Instructor: <strong>{activeVideo.instructor}</strong></span>
                <span>Duration: <strong>{activeVideo.duration}</strong></span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                <span className="font-bold block mb-1">Topics Explored in this Masterclass:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  {(activeVideo.topicsCovered || []).map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => handleToggleLecture(activeVideo.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    session.completedLectures.includes(activeVideo.id)
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-[#0F1E36] text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>
                    {session.completedLectures.includes(activeVideo.id)
                      ? 'Lecture Completed'
                      : 'Mark Lecture as Watched'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Close Player
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Study Note View Modal */}
      {activeNote && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35]">
                  {activeNote.subject} · {activeNote.chapter}
                </span>
                <h3 className="text-xl font-bold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
                  {activeNote.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveNote(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-bold text-slate-500 uppercase block">Chapter Summary</span>
                <p>{activeNote.summary}</p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-[#0F1E36] text-sm uppercase block">
                  High-Yield Revision Points & Principles
                </span>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-600">
                  {activeNote.keyPoints.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                <strong>Note Resource Notice:</strong> Full multi-page PDF documents are distributed through BrightPath classroom study packs. Digital handouts for this chapter can be printed directly from this viewer.
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Print / Save PDF
              </button>
              <button
                type="button"
                onClick={() => setActiveNote(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0F1E36] rounded-xl"
              >
                Close Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
