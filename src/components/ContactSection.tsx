import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Loader2,
  Database,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';
import { submitRegistration, isSupabaseConfigured, Registration } from '../lib/supabase';

interface ContactSectionProps {
  selectedCoursePreset?: string;
  enquiryNotePreset?: string;
  onClearPreset?: () => void;
  onOpenAdmin?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  selectedCoursePreset = '',
  enquiryNotePreset = '',
  onClearPreset,
  onOpenAdmin
}) => {
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(
    selectedCoursePreset || ACADEMY_CONFIG.courses[0].title
  );
  const [batchPreference, setBatchPreference] = useState('Morning Batch (7:00 AM – 9:30 AM)');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; course?: string }>({});

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [savedRegistration, setSavedRegistration] = useState<Registration | null>(null);
  const [isDemoModeNotice, setIsDemoModeNotice] = useState(false);
  const [emailAlertDispatched, setEmailAlertDispatched] = useState(false);
  const [lastSubmittedSignature, setLastSubmittedSignature] = useState<string | null>(null);

  // WhatsApp Demo Modal
  const [showDemoWhatsAppNotice, setShowDemoWhatsAppNotice] = useState(false);
  const [preparedWhatsAppUrl, setPreparedWhatsAppUrl] = useState('');
  const [preparedMessageText, setPreparedMessageText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Sync preset if changed from outside (e.g. user clicked a specific course)
  useEffect(() => {
    if (selectedCoursePreset) {
      setSelectedCourse(selectedCoursePreset);
    }
  }, [selectedCoursePreset]);

  useEffect(() => {
    if (enquiryNotePreset) {
      setMessage((prev) => (prev ? `${prev}\n${enquiryNotePreset}` : enquiryNotePreset));
    }
  }, [enquiryNotePreset]);

  // Validation
  const validateForm = () => {
    const errs: { name?: string; email?: string; phone?: string; course?: string } = {};

    if (!studentName.trim() || studentName.trim().length < 2) {
      errs.name = 'Please enter student or parent name (at least 2 letters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = 'Please provide a valid email address for registration confirmation.';
    }

    const cleanPhone = phoneNumber.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please provide a valid 10-digit mobile number.';
    }

    if (!selectedCourse) {
      errs.course = 'Please select a course.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const constructWhatsAppMessage = (refId?: string) => {
    const lines = [
      `*Course Registration — ${ACADEMY_CONFIG.name}*`,
      refId ? `• Reference ID: ${refId}` : '',
      `• Student Name: ${studentName.trim()}`,
      `• Email: ${email.trim()}`,
      `• Contact: ${phoneNumber.trim()}`,
      `• Course: ${selectedCourse}`,
      `• Batch Preference: ${batchPreference}`,
    ].filter(Boolean);

    if (message.trim()) {
      lines.push(`• Notes / Goals: ${message.trim()}`);
    }

    return lines.join('\n');
  };

  // Main Database Submission Handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!validateForm()) return;

    // Duplicate submission prevention
    const currentSignature = `${studentName.trim().toLowerCase()}_${phoneNumber.replace(/[\s-]/g, '')}_${selectedCourse}`;
    if (lastSubmittedSignature === currentSignature) {
      setSubmissionError('You have already submitted this registration. If you wish to make changes, please speak with our admissions desk.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitRegistration({
        student_name: studentName.trim(),
        email: email.trim().toLowerCase(),
        phone: phoneNumber.trim(),
        course: selectedCourse,
        batch_preference: batchPreference,
        message: message.trim() || undefined,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Unable to store registration in the database.');
      }

      // Success confirmed by database
      setSavedRegistration(response.data);
      setIsDemoModeNotice(response.isDemoMode);
      setEmailAlertDispatched(Boolean(response.emailNotificationSent));
      setLastSubmittedSignature(currentSignature);

      // Prepare WhatsApp backup message with reference ID
      const refId = `#BP-${response.data.id.slice(0, 8).toUpperCase()}`;
      const waText = constructWhatsAppMessage(refId);
      setPreparedMessageText(waText);
      const encoded = encodeURIComponent(waText);
      setPreparedWhatsAppUrl(`https://wa.me/${ACADEMY_CONFIG.whatsAppNumber}?text=${encoded}`);
    } catch (err: any) {
      console.error('Registration submission error:', err);
      setSubmissionError(err.message || 'An unexpected error occurred while saving your registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirectClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const text = constructWhatsAppMessage();
    setPreparedMessageText(text);
    const encoded = encodeURIComponent(text);
    const targetUrl = `https://wa.me/${ACADEMY_CONFIG.whatsAppNumber}?text=${encoded}`;
    setPreparedWhatsAppUrl(targetUrl);

    if (ACADEMY_CONFIG.isDemoNumber) {
      setShowDemoWhatsAppNotice(true);
    } else {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(preparedMessageText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleResetForm = () => {
    setStudentName('');
    setEmail('');
    setPhoneNumber('');
    setMessage('');
    setSavedRegistration(null);
    setSubmissionError(null);
    setLastSubmittedSignature(null);
    if (onClearPreset) onClearPreset();
  };

  return (
    <section id="contact" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B35] mb-2">
            <span>Official Course Registration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F1E36] tracking-tight font-['Plus_Jakarta_Sans']">
            Enrol for Academic Session 2026–2027
          </h2>
          <p className="text-slate-600 text-base mt-3 leading-relaxed">
            Register your course preference below. Your submission is securely recorded and queued for immediate academic counseling.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Cards & Office Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="bg-[#0F1E36] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6B35]/20 rounded-full blur-2xl pointer-events-none" />

              <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans'] tracking-tight">
                Academic Counseling Centre
              </h3>
              <p className="text-slate-300 text-xs mt-1">
                Walk in for an in-person campus visit or consultation.
              </p>

              <div className="mt-6 space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#FF6B35]" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-200 block">Institute Address</span>
                    <span className="text-slate-300 leading-normal block mt-0.5">
                      {ACADEMY_CONFIG.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#FF6B35]" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-200 block">Admissions Desk</span>
                    <span className="text-white font-semibold mt-0.5 block">
                      {ACADEMY_CONFIG.phoneDisplay}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#FF6B35]" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-200 block">Email Admissions</span>
                    <a
                      href={`mailto:${ACADEMY_CONFIG.email}`}
                      className="text-slate-300 hover:text-white mt-0.5 block transition-colors"
                    >
                      {ACADEMY_CONFIG.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#FF6B35]" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-200 block">Visiting & Doubt Hours</span>
                    <span className="text-slate-300 leading-normal block mt-0.5">
                      {ACADEMY_CONFIG.workingHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout in Left Card */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    const text = `Hello ${ACADEMY_CONFIG.name}, I would like to inquire about course admissions and demo classes.`;
                    const url = `https://wa.me/${ACADEMY_CONFIG.whatsAppNumber}?text=${encodeURIComponent(text)}`;
                    setPreparedWhatsAppUrl(url);
                    setPreparedMessageText(text);
                    if (ACADEMY_CONFIG.isDemoNumber) {
                      setShowDemoWhatsAppNotice(true);
                    } else {
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Admissions on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Admin Portal Shortcut Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#0F1E36] block">
                  Institute Faculty & Staff
                </span>
                <span className="text-slate-500">
                  Manage submitted applications in the Admin Dashboard.
                </span>
              </div>
              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="px-3 py-1.5 font-bold text-xs bg-[#0F1E36] text-white rounded-lg hover:bg-[#1A2E4D] transition-colors whitespace-nowrap"
                >
                  Admin Login
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Admission Enquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6 sm:p-8 text-left shadow-xs">
              {savedRegistration ? (
                /* Confirmed Saved State - ONLY shown after database confirms persistence */
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        Registration Confirmed & Saved
                      </span>
                      <h3 className="text-2xl font-extrabold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
                        Thank You, {savedRegistration.student_name}!
                      </h3>
                    </div>
                  </div>

                  {/* Reference ID Pill */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-semibold block uppercase">Registration Reference</span>
                      <span className="text-lg font-black text-[#FF6B35] font-mono">
                        #BP-{savedRegistration.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Status: {savedRegistration.status}
                    </span>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 bg-slate-100/70 rounded-xl space-y-2 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Selected Course:</span>
                      <span className="font-bold text-[#0F1E36]">{savedRegistration.course}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Batch Timing:</span>
                      <span className="font-semibold text-slate-800">{savedRegistration.batch_preference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mobile Number:</span>
                      <span className="font-mono text-slate-800">+91 {savedRegistration.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email Address:</span>
                      <span className="font-mono text-slate-800">{savedRegistration.email}</span>
                    </div>
                  </div>

                  {/* Storage & Notification Badges */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                      <Database className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        {isDemoModeNotice
                          ? 'Stored securely in demo storage. When Supabase is connected, records persist to Cloud PostgreSQL.'
                          : 'Successfully recorded in Supabase PostgreSQL database.'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                      <Mail className="w-4 h-4 text-[#FF6B35] shrink-0" />
                      <span>
                        {emailAlertDispatched
                          ? 'Automatic email alert sent to the admissions director.'
                          : 'Admissions team notified. You may also connect on WhatsApp below.'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <a
                      href={preparedWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Share Ref #{savedRegistration.id.slice(0, 6)} on WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="py-3 px-4 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
                    >
                      Register Another Student
                    </button>
                  </div>
                </div>
              ) : (
                /* Interactive Registration Form */
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
                        Course Registration Form
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Complete your details to secure your batch seat or request a demo class.
                      </p>
                    </div>
                    <span className="hidden sm:inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {isSupabaseConfigured() ? 'Cloud DB Active' : 'Demo Mode Active'}
                    </span>
                  </div>

                  {/* Submission Error Banner */}
                  {submissionError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold">Registration Failed:</span> {submissionError}
                      </div>
                    </div>
                  )}

                  {/* Student Name */}
                  <div>
                    <label
                      htmlFor="student-name"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                    >
                      Student / Parent Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="student-name"
                      type="text"
                      disabled={isSubmitting}
                      value={studentName}
                      onChange={(e) => {
                        setStudentName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      placeholder="e.g. Priyanshu Sharma"
                      className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-[#0F1E36] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F1E36] transition-all disabled:opacity-60 ${
                        errors.name ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email & Phone 2-Col Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email Field */}
                    <div>
                      <label
                        htmlFor="email-address"
                        className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email-address"
                        type="email"
                        disabled={isSubmitting}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        placeholder="e.g. priyanshu@example.com"
                        className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-[#0F1E36] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F1E36] transition-all disabled:opacity-60 ${
                          errors.email ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Mobile Number Field */}
                    <div>
                      <label
                        htmlFor="phone-number"
                        className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                      >
                        Mobile / WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phone-number"
                        type="tel"
                        disabled={isSubmitting}
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          if (errors.phone) setErrors({ ...errors, phone: undefined });
                        }}
                        placeholder="Enter 10-digit mobile number"
                        className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-[#0F1E36] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F1E36] transition-all disabled:opacity-60 ${
                          errors.phone ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Course Dropdown & Batch Preference */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="course-selection"
                        className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                      >
                        Target Course <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="course-selection"
                        disabled={isSubmitting}
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm text-[#0F1E36] focus:outline-none focus:ring-2 focus:ring-[#0F1E36] transition-all disabled:opacity-60"
                      >
                        {ACADEMY_CONFIG.courses.map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title}
                          </option>
                        ))}
                        <option value="Free Academic Counseling">
                          Free Academic Counseling / Diagnostic Test
                        </option>
                        <option value="Merit Scholarship Application">
                          Merit Scholarship Application
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="batch-preference"
                        className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                      >
                        Preferred Timing
                      </label>
                      <select
                        id="batch-preference"
                        disabled={isSubmitting}
                        value={batchPreference}
                        onChange={(e) => setBatchPreference(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm text-[#0F1E36] focus:outline-none focus:ring-2 focus:ring-[#0F1E36] transition-all disabled:opacity-60"
                      >
                        <option value="Morning Batch (7:00 AM – 9:30 AM)">
                          Morning Batch (7:00 AM – 9:30 AM)
                        </option>
                        <option value="Evening Batch (4:00 PM – 7:30 PM)">
                          Evening Batch (4:00 PM – 7:30 PM)
                        </option>
                        <option value="Weekend Intensive Cohort (Sat & Sun)">
                          Weekend Intensive Cohort (Sat & Sun)
                        </option>
                        <option value="Flexible / Need Guidance">
                          Flexible / Need Guidance
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Message / Academic Goals */}
                  <div>
                    <label
                      htmlFor="message-text"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                    >
                      Academic Goals & Prior Marks (Optional)
                    </label>
                    <textarea
                      id="message-text"
                      rows={3}
                      disabled={isSubmitting}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. Scored 91% in Class 10 CBSE, preparing for JEE 2027. Interested in morning classroom batch..."
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm text-[#0F1E36] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F1E36] transition-all resize-none disabled:opacity-60"
                    />
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 text-xs font-bold text-white bg-gradient-to-r from-[#FF6B35] to-[#FA8A3C] hover:from-[#E8551F] hover:to-[#FF6B35] rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving to Database...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Course Registration</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleWhatsAppDirectClick}
                      className="inline-flex items-center justify-center gap-2 py-3 px-5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors shadow-xs disabled:opacity-60"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp Directly</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 text-center">
                    🔒 Registration is securely recorded in the academy's database. Student data is never sold or shared.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Helpful WhatsApp Configuration Modal (For Demo / Freelance Presentation) */}
      {showDemoWhatsAppNotice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-left space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <h4 className="text-base font-bold font-['Plus_Jakarta_Sans']">
                  WhatsApp Direct Inquiry Ready
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowDemoWhatsAppNotice(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Your inquiry has been compiled into the official WhatsApp format:
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono whitespace-pre-wrap text-slate-700 max-h-40 overflow-y-auto">
              {preparedMessageText}
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-normal">
              <strong>Configuration Notice:</strong> WhatsApp contact number is awaiting verification by the institute owner. To direct enquiries to your verified WhatsApp business line, configure <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">whatsAppNumber</code> in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">src/config/academyConfig.ts</code>.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleCopyMessage}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                {copySuccess ? 'Copied!' : 'Copy Text'}
              </button>
              {ACADEMY_CONFIG.whatsAppNumber ? (
                <a
                  href={preparedWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowDemoWhatsAppNotice(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  <span>Launch WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDemoWhatsAppNotice(false)}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0F1E36] hover:bg-[#1A2E4D] rounded-lg shadow-sm"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
