/**
 * Student Authentication & Enrollment Manager
 * 
 * Manages student sessions, course enrollment permissions, and progress tracking.
 * Operates in Demo Mode with persistent localStorage, with full compatibility
 * to bind to Supabase Auth user profiles when credentials are provided.
 */

export interface StudentSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrolledCourses: string[]; // List of course IDs, e.g. ['jee-preparation']
  completedLectures: string[];
  checklistCompleted: string[];
  testHistory: Array<{
    testId: string;
    testTitle: string;
    courseId: string;
    score: number;
    totalMarks: number;
    percentage: number;
    submittedAt: string;
  }>;
  isDemoSession: boolean;
  lastActiveCourseId: string;
}

const STUDENT_SESSION_STORAGE_KEY = 'brightpath_student_session';

// Default initial demo student session if none exists
const DEFAULT_DEMO_STUDENT: StudentSession = {
  id: 'student-demo-2026',
  name: 'Priyanshu Sharma',
  email: 'priyanshu@student.brightpath.edu.in',
  phone: '9800000001',
  enrolledCourses: ['jee-preparation'],
  completedLectures: ['jee-phy-101'],
  checklistCompleted: ['chk-1', 'chk-2'],
  testHistory: [
    {
      testId: 'jee-mock-01',
      testTitle: 'JEE Main Diagnostic Simulation Test #1',
      courseId: 'jee-preparation',
      score: 28,
      totalMarks: 36,
      percentage: 77.8,
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    }
  ],
  isDemoSession: true,
  lastActiveCourseId: 'jee-preparation'
};

/**
 * Get current student session from browser storage
 */
export function getStudentSession(): StudentSession | null {
  try {
    const raw = localStorage.getItem(STUDENT_SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load student session', e);
    return null;
  }
}

/**
 * Save student session to storage
 */
export function saveStudentSession(session: StudentSession): void {
  try {
    localStorage.setItem(STUDENT_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save student session', e);
  }
}

/**
 * Automatically enroll or update student session when registering for a course
 */
export function enrollStudentFromRegistration(
  studentName: string,
  email: string,
  phone: string,
  courseIdOrTitle: string
): StudentSession {
  // Map friendly title to course ID
  let courseId = courseIdOrTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
  if (courseId.includes('jee')) courseId = 'jee-preparation';
  else if (courseId.includes('neet')) courseId = 'neet-preparation';
  else if (courseId.includes('11') || courseId.includes('12')) courseId = 'class-11-12-science';
  else if (courseId.includes('9') || courseId.includes('10')) courseId = 'class-9-10-foundation';
  else courseId = 'jee-preparation'; // Fallback

  const existing = getStudentSession();

  let session: StudentSession;
  if (existing) {
    const enrolled = Array.from(new Set([...existing.enrolledCourses, courseId]));
    session = {
      ...existing,
      name: studentName || existing.name,
      email: email || existing.email,
      phone: phone || existing.phone,
      enrolledCourses: enrolled,
      lastActiveCourseId: courseId
    };
  } else {
    session = {
      id: `std-${Date.now()}`,
      name: studentName || 'Enrolled Student',
      email: email || 'student@brightpath.edu.in',
      phone: phone || '',
      enrolledCourses: [courseId],
      completedLectures: [],
      checklistCompleted: [],
      testHistory: [],
      isDemoSession: true,
      lastActiveCourseId: courseId
    };
  }

  saveStudentSession(session);
  return session;
}

/**
 * Quick Demo Student Login (for testing the learning dashboard instantly)
 */
export function loginDemoStudent(preferredCourseId: string = 'jee-preparation'): StudentSession {
  const session: StudentSession = {
    ...DEFAULT_DEMO_STUDENT,
    enrolledCourses: Array.from(new Set([...DEFAULT_DEMO_STUDENT.enrolledCourses, preferredCourseId])),
    lastActiveCourseId: preferredCourseId
  };
  saveStudentSession(session);
  return session;
}

/**
 * Student Logout
 */
export function logoutStudent(): void {
  localStorage.removeItem(STUDENT_SESSION_STORAGE_KEY);
}

/**
 * Mark a lecture as watched/completed
 */
export function toggleLectureWatched(lectureId: string): boolean {
  const session = getStudentSession();
  if (!session) return false;

  const exists = session.completedLectures.includes(lectureId);
  const updatedLectures = exists
    ? session.completedLectures.filter(id => id !== lectureId)
    : [...session.completedLectures, lectureId];

  saveStudentSession({
    ...session,
    completedLectures: updatedLectures
  });

  return !exists;
}

/**
 * Toggle a revision checklist item
 */
export function toggleRevisionItem(itemId: string): boolean {
  const session = getStudentSession();
  if (!session) return false;

  const exists = session.checklistCompleted.includes(itemId);
  const updatedList = exists
    ? session.checklistCompleted.filter(id => id !== itemId)
    : [...session.checklistCompleted, itemId];

  saveStudentSession({
    ...session,
    checklistCompleted: updatedList
  });

  return !exists;
}

/**
 * Record a mock test result
 */
export function recordMockTestSubmission(
  testId: string,
  testTitle: string,
  courseId: string,
  score: number,
  totalMarks: number
): void {
  const session = getStudentSession();
  if (!session) return;

  const percentage = Math.round((score / totalMarks) * 100 * 10) / 10;
  const newRecord = {
    testId,
    testTitle,
    courseId,
    score,
    totalMarks,
    percentage,
    submittedAt: new Date().toISOString()
  };

  saveStudentSession({
    ...session,
    testHistory: [newRecord, ...(session.testHistory || [])]
  });
}
