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
  HelpCircle
} from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';

interface ContactSectionProps {
  selectedCoursePreset?: string;
  enquiryNotePreset?: string;
  onClearPreset?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  selectedCoursePreset = '',
  enquiryNotePreset = '',
  onClearPreset
}) => {
  const [studentName, setStudentName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(
    selectedCoursePreset || ACADEMY_CONFIG.courses[0].title
  );
  const [batchPreference, setBatchPreference] = useState('Morning Batch');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; course?: string }>({});
  
  // Modal / Flow states
  const [showDemoWhatsAppNotice, setShowDemoWhatsAppNotice] = useState(false);
  const [preparedWhatsAppUrl, setPreparedWhatsAppUrl] = useState('');
  const [preparedMessageText, setPreparedMessageText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [submissionCompleted, setSubmissionCompleted] = useState(false);

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
    const errs: { name?: string; phone?: string; course?: string } = {};

    if (!studentName.trim() || studentName.trim().length < 2) {
      errs.name = 'Please enter student or parent name (at least 2 letters).';
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

  const constructWhatsAppMessage = () => {
    const lines = [
      `*Admission Enquiry — ${ACADEMY_CONFIG.name}*`,
      `• Student Name: ${studentName.trim()}`,
      `• Contact: ${phoneNumber.trim()}`,
      `• Course: ${selectedCourse}`,
      `• Batch Preference: ${batchPreference}`,
    ];

    if (message.trim()) {
      lines.push(`• Notes / Goals: ${message.trim()}`);
    }

    return lines.join('\n');
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const text = constructWhatsAppMessage();
    const encoded = encodeURIComponent(text);
    const targetUrl = `https://wa.me/${ACADEMY_CONFIG.whatsAppNumber}?text=${encoded}`;

    setPreparedWhatsAppUrl(targetUrl);
    setPreparedMessageText(text);

    // If it's a demonstration number, show the helpful guidance modal
    if (ACADEMY_CONFIG.isDemoNumber) {
      setShowDemoWhatsAppNotice(true);
    } else {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const text = constructWhatsAppMessage();
    setPreparedMessageText(text);
    const encoded = encodeURIComponent(text);
    setPreparedWhatsAppUrl(`https://wa.me/${ACADEMY_CONFIG.whatsAppNumber}?text=${encoded}`);

    setSubmissionCompleted(true);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(preparedMessageText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleResetForm = () => {
    setStudentName('');
    setPhoneNumber('');
    setMessage('');
    setSubmissionCompleted(false);
    if (onClearPreset) onClearPreset();
  };

  return (
    <section id="contact" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B35] mb-2">
            <span>Admissions & Counseling Desk</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F1E36] tracking-tight font-['Plus_Jakarta_Sans']">
            Begin Your Academic Journey Today
          </h2>
          <p className="text-slate-600 text-base mt-3 leading-relaxed">
            Have questions about batch timings, fee structures, or demo classes? Send us an enquiry or connect directly on WhatsApp with our academic counselor.
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
                    <span className="font-bold text-slate-200 block">Telephone Inquiry</span>
                    <a
                      href={`tel:${ACADEMY_CONFIG.phoneNumberRaw}`}
                      className="text-white hover:text-[#FF6B35] font-semibold mt-0.5 block transition-colors"
                    >
                      {ACADEMY_CONFIG.phoneDisplay}
                    </a>
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

            {/* Config Notice for Freelance Client */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              <span className="font-bold text-[#0F1E36] block mb-1">
                Developer & Customisation Note:
              </span>
              All telephone numbers, address details, and WhatsApp settings are maintained in <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">src/config/academyConfig.ts</code> for zero-code rebranding.
            </div>
          </div>

          {/* Right Column: Admission Enquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6 sm:p-8 text-left shadow-xs">
              {submissionCompleted ? (
                /* Honest Submission Complete State */
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
                    Enquiry Details Prepared Successfully!
                  </h3>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                    <strong>Notice:</strong> This website is a frontend client demonstration without a persistent backend database. Your enquiry has not been stored in a remote server. To send this directly to the institute, use the WhatsApp button below.
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-2 font-mono whitespace-pre-wrap text-slate-700">
                    {preparedMessageText}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <a
                      href={preparedWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-3 px-5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Send to Institute via WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="inline-flex items-center justify-center gap-1.5 py-3 px-4 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>{copySuccess ? 'Copied to Clipboard!' : 'Copy Message Text'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="py-3 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      Submit Another Query
                    </button>
                  </div>
                </div>
              ) : (
                /* Interactive Form */
                <form onSubmit={handleStandardSubmit} className="space-y-5">
                  <div className="border-b border-slate-200 pb-3">
                    <h3 className="text-xl font-bold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
                      Student Admission & Demo Class Enquiry
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Fill out the form below. We will prepare your query and let you submit or connect over WhatsApp.
                    </p>
                  </div>

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
                      value={studentName}
                      onChange={(e) => {
                        setStudentName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      placeholder="e.g. Priyanshu Sharma"
                      className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-[#0F1E36] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F1E36] transition-all ${
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

                  {/* Phone Number */}
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
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (errors.phone) setErrors({ ...errors, phone: undefined });
                      }}
                      placeholder="e.g. 9876543210 (10 digits)"
                      className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-[#0F1E36] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F1E36] transition-all ${
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
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm text-[#0F1E36] focus:outline-none focus:ring-2 focus:ring-[#0F1E36] transition-all"
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
                        value={batchPreference}
                        onChange={(e) => setBatchPreference(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm text-[#0F1E36] focus:outline-none focus:ring-2 focus:ring-[#0F1E36] transition-all"
                      >
                        <option value="Morning Batch (7:00 AM – 9:30 AM)">
                          Morning Batch (7:00 AM – 9:30 AM)
                        </option>
                        <option value="Evening Batch (4:00 PM – 7:30 PM)">
                          Evening Batch (4:00 PM – 7:30 PM)
                        </option>
                        <option value="Weekend Intensive Cohort">
                          Weekend Intensive Cohort (Sat & Sun)
                        </option>
                        <option value="Flexible / Need Advice">
                          Flexible / Needs Advice
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
                      Message / Academic Goals (Optional)
                    </label>
                    <textarea
                      id="message-text"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. Interested in booking a trial class for Class 11 Science PCM, aiming for JEE 2027..."
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm text-[#0F1E36] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F1E36] transition-all resize-none"
                    />
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="submit"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 text-xs font-bold text-white bg-gradient-to-r from-[#FF6B35] to-[#FA8A3C] hover:from-[#E8551F] hover:to-[#FF6B35] rounded-xl shadow-sm hover:shadow transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Enquiry</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppSubmit}
                      className="inline-flex items-center justify-center gap-2 py-3 px-5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>Send via WhatsApp</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 text-center">
                    🔒 We respect your privacy. Student phone numbers are never shared with 3rd parties.
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
                  WhatsApp Integration Ready
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
              Your inquiry has been compiled into the official WhatsApp message format:
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono whitespace-pre-wrap text-slate-700 max-h-40 overflow-y-auto">
              {preparedMessageText}
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-normal">
              <strong>Freelance Notice:</strong> The current target is the placeholder number{' '}
              <span className="font-mono font-bold">{ACADEMY_CONFIG.phoneDisplay}</span>. To redirect enquiries to a live WhatsApp business number, simply set <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">whatsAppNumber</code> in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">src/config/academyConfig.ts</code>.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleCopyMessage}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                {copySuccess ? 'Copied!' : 'Copy Text'}
              </button>
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
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
