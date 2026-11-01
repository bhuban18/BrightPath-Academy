/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { AdminDashboard } from './components/AdminDashboard';
import { ACADEMY_CONFIG } from './config/academyConfig';

export default function App() {
  const [currentView, setCurrentView] = useState<'website' | 'admin'>('website');
  const [selectedCourseForEnquiry, setSelectedCourseForEnquiry] = useState<string>('');
  const [enquiryNote, setEnquiryNote] = useState<string>('');
  const [showGlobalWhatsAppNotice, setShowGlobalWhatsAppNotice] = useState(false);

  // Sync view with URL hash (e.g. #admin)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else if (currentView === 'admin') {
        setCurrentView('website');
      }
    };

    if (window.location.hash === '#admin') {
      setCurrentView('admin');
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openAdminPortal = () => {
    window.location.hash = '#admin';
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToWebsite = () => {
    window.location.hash = '';
    setCurrentView('website');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToContact = () => {
    if (currentView === 'admin') {
      setCurrentView('website');
    }
    setTimeout(() => {
      const contactElement = document.getElementById('contact');
      if (contactElement) {
        contactElement.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const input = document.getElementById('student-name');
          if (input) input.focus();
        }, 400);
      }
    }, 100);
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

  // If Admin Portal is active, render Admin Dashboard
  if (currentView === 'admin') {
    return <AdminDashboard onBackToWebsite={backToWebsite} />;
  }

  // Otherwise, render Public Website
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#191C1E] flex flex-col font-['Inter'] relative selection:bg-[#FF6B35]/20 selection:text-[#0F1E36]">
      {/* Top Banner indicating registration system active */}
      <div className="bg-[#0F1E36] text-white py-1.5 px-4 text-center text-[11px] font-medium border-b border-slate-700 flex items-center justify-center gap-2">
        <span className="text-[#FF6B35] font-bold">Admissions 2026–27:</span>
        <span>Online Registration & Admin System Active</span>
        <span className="text-slate-500">|</span>
        <button
          onClick={openAdminPortal}
          className="text-amber-300 hover:text-white underline font-semibold cursor-pointer"
        >
          Staff & Admin Portal
        </button>
      </div>

      {/* Primary Navigation */}
      <Navbar
        onEnquireClick={scrollToContact}
        onOpenWhatsApp={handleWhatsAppGeneral}
        onOpenAdmin={openAdminPortal}
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

        {/* Contact and Enquiry Form with WhatsApp & Database Integration */}
        <ContactSection
          selectedCoursePreset={selectedCourseForEnquiry}
          enquiryNotePreset={enquiryNote}
          onClearPreset={() => {
            setSelectedCourseForEnquiry('');
            setEnquiryNote('');
          }}
          onOpenAdmin={openAdminPortal}
        />
      </main>

      {/* Footer */}
      <Footer onEnquireClick={scrollToContact} onOpenAdmin={openAdminPortal} />

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
              WhatsApp Direct Integration
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              In production, this button connects directly to {ACADEMY_CONFIG.name}'s official WhatsApp admissions desk.
            </p>
            <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              The institute's official phone number has not yet been verified. To add your verified WhatsApp line, update <code className="font-mono font-bold">whatsAppNumber</code> in <code className="font-mono font-bold">src/config/academyConfig.ts</code>.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowGlobalWhatsAppNotice(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
              {ACADEMY_CONFIG.whatsAppNumber ? (
                <a
                  href={`https://wa.me/${ACADEMY_CONFIG.whatsAppNumber}?text=${encodeURIComponent(`Hello ${ACADEMY_CONFIG.name}, I would like to enquire about courses.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowGlobalWhatsAppNotice(false)}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Open WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
