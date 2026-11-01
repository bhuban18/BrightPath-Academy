/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustStats } from './components/TrustStats';
import { Courses } from './components/Courses';
import { WhyChooseUs } from './components/WhyChooseUs';
import { About } from './components/About';
import { ScholarshipCalculator } from './components/ScholarshipCalculator';
import { Results } from './components/Results';
import { Testimonials } from './components/Testimonials';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { StickyMobileBar } from './components/StickyMobileBar';
import { FreelanceCustomizerModal } from './components/FreelanceCustomizerModal';
import { ACADEMY_CONFIG } from './config/academyConfig';

export default function App() {
  const [selectedCourseForEnquiry, setSelectedCourseForEnquiry] = useState<string>('');
  const [enquiryNote, setEnquiryNote] = useState<string>('');
  const [showGlobalWhatsAppNotice, setShowGlobalWhatsAppNotice] = useState(false);

  const scrollToContact = () => {
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
      // Focus name input after brief scroll
      setTimeout(() => {
        const input = document.getElementById('student-name');
        if (input) input.focus();
      }, 400);
    }
  };

  const handleSelectCourse = (courseTitle: string) => {
    setSelectedCourseForEnquiry(courseTitle);
    scrollToContact();
  };

  const handleBookDemo = () => {
    setEnquiryNote('Interested in booking a 2-day Free Trial Demo Class.');
    scrollToContact();
  };

  const handleClaimScholarship = (percentage: number, waiver: number) => {
    setSelectedCourseForEnquiry('Merit Scholarship Application');
    setEnquiryNote(`Calculated ${waiver}% Merit Scholarship waiver based on ${percentage}% previous exam score.`);
    scrollToContact();
  };

  const handleWhatsAppGeneral = () => {
    const text = `Hello ${ACADEMY_CONFIG.name}, I would like to enquire about courses and admissions.`;
    const url = `https://wa.me/${ACADEMY_CONFIG.whatsAppNumber}?text=${encodeURIComponent(text)}`;

    if (ACADEMY_CONFIG.isDemoNumber) {
      setShowGlobalWhatsAppNotice(true);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleWhatsAppCourseSpecific = (courseTitle: string) => {
    const text = `Hello ${ACADEMY_CONFIG.name}, I would like to enquire about the "${courseTitle}" batch details and schedule.`;
    const url = `https://wa.me/${ACADEMY_CONFIG.whatsAppNumber}?text=${encodeURIComponent(text)}`;

    if (ACADEMY_CONFIG.isDemoNumber) {
      setShowGlobalWhatsAppNotice(true);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#191C1E] flex flex-col font-['Inter'] relative selection:bg-[#FF6B35]/20 selection:text-[#0F1E36]">
      {/* Top Banner indicating demonstration template (Can be removed in production) */}
      <div className="bg-[#0F1E36] text-white py-1.5 px-4 text-center text-[11px] font-medium border-b border-slate-700">
        <span className="text-[#FF6B35] font-bold">Demonstration Template:</span> Designed for Indian Coaching Institutes & Private Tutors · Fully Customizable in <code className="text-amber-200">academyConfig.ts</code>
      </div>

      {/* Primary Navigation */}
      <Navbar
        onEnquireClick={scrollToContact}
        onOpenWhatsApp={handleWhatsAppGeneral}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreCourses={() => {
            const coursesEl = document.getElementById('courses');
            if (coursesEl) coursesEl.scrollIntoView({ behavior: 'smooth' });
          }}
          onBookDemo={handleBookDemo}
        />

        {/* Trust Indicators & Editable Stats */}
        <TrustStats />

        {/* Courses Section with 4 Required Courses */}
        <Courses
          onSelectCourseForEnquiry={handleSelectCourse}
          onWhatsAppForCourse={handleWhatsAppCourseSpecific}
        />

        {/* Why Choose Us: 4 Core Pillars */}
        <WhyChooseUs onEnquireClick={scrollToContact} />

        {/* About the Institute & Teacher Profile */}
        <About />

        {/* Interactive Merit Scholarship Estimator */}
        <ScholarshipCalculator onClaimScholarship={handleClaimScholarship} />

        {/* Results and Achievements Showcase */}
        <Results />

        {/* Testimonials */}
        <Testimonials />

        {/* Frequently Asked Questions */}
        <FaqSection />

        {/* Contact and Enquiry Form with WhatsApp Integration */}
        <ContactSection
          selectedCoursePreset={selectedCourseForEnquiry}
          enquiryNotePreset={enquiryNote}
          onClearPreset={() => {
            setSelectedCourseForEnquiry('');
            setEnquiryNote('');
          }}
        />
      </main>

      {/* Footer */}
      <Footer onEnquireClick={scrollToContact} />

      {/* Mobile Sticky Bar (<768px) */}
      <StickyMobileBar
        onEnquireClick={scrollToContact}
        onWhatsAppClick={handleWhatsAppGeneral}
      />

      {/* Freelance Demo Guide Modal Launcher */}
      <FreelanceCustomizerModal />

      {/* Global WhatsApp Notice Modal if triggered from Nav or Hero */}
      {showGlobalWhatsAppNotice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left space-y-4">
            <h4 className="text-base font-bold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
              WhatsApp Enquiry Integration
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              In production, this button connects directly to {ACADEMY_CONFIG.name}'s WhatsApp Business line (<span className="font-mono font-semibold">{ACADEMY_CONFIG.phoneDisplay}</span>).
            </p>
            <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              To configure a real phone number, open <code className="font-mono font-bold">src/config/academyConfig.ts</code> and update <code className="font-mono font-bold">whatsAppNumber</code>.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowGlobalWhatsAppNotice(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
              <a
                href={`https://wa.me/${ACADEMY_CONFIG.whatsAppNumber}?text=${encodeURIComponent(`Hello ${ACADEMY_CONFIG.name}, I would like to enquire about courses.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowGlobalWhatsAppNotice(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
              >
                Open WhatsApp Anyway
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
