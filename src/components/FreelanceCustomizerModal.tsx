import React, { useState } from 'react';
import { Settings, X, CheckCircle, Code, Smartphone, Globe, Sparkles } from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';

export const FreelanceCustomizerModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Demo Launcher Pill at Bottom Left */}
      <div className="fixed bottom-5 left-5 z-40 hidden sm:block">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0F1E36] text-white text-xs font-semibold shadow-lg hover:bg-[#1A2E4D] border border-slate-700 transition-all hover:scale-105"
          title="Freelance Client Customization Guide"
        >
          <Settings className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span>Freelance Demo Guide</span>
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-left space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0F1E36] flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
                    Freelance Client Customisation Guide
                  </h4>
                  <p className="text-xs text-slate-500">
                    How to rebrand this website for any coaching institute in under 5 minutes
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-[#0F1E36] flex items-center gap-1.5 text-xs">
                  <Code className="w-3.5 h-3.5 text-[#FF6B35]" />
                  <span>1. Single Source of Truth Configuration</span>
                </span>
                <p>
                  Every string, telephone number, WhatsApp contact, faculty bio, course curriculum, and achievement is located in a single file: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">src/config/academyConfig.ts</code>. You never need to touch core HTML or CSS to change text.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-[#0F1E36] flex items-center gap-1.5 text-xs">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Zero-Cost WhatsApp Lead Capture</span>
                </span>
                <p>
                  No expensive SMS gateways or third-party database servers needed. Every enquiry formats a professional WhatsApp draft directly to the coaching center’s phone number.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-[#0F1E36] flex items-center gap-1.5 text-xs">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>3. Netlify Ready (1-Click Deployment)</span>
                </span>
                <p>
                  Runs with standard Vite build: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">npm run build</code> producing clean static files in the <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">dist</code> folder with zero backend or database dependency.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800 block">Demonstration Details Currently Active:</span>
                <ul className="space-y-1 pl-4 list-disc text-slate-500">
                  <li>Institute Name: {ACADEMY_CONFIG.name}</li>
                  <li>Inquiry Desk: {ACADEMY_CONFIG.phoneDisplay}</li>
                  <li>WhatsApp: {ACADEMY_CONFIG.whatsAppNumber ? `+${ACADEMY_CONFIG.whatsAppNumber}` : 'Pending configuration in academyConfig.ts'}</li>
                  <li>Courses: 4 Specialised Batches (Foundation, 11-12 Science, JEE, NEET)</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0F1E36] hover:bg-[#1A2E4D] rounded-xl"
              >
                Got It, Return to Website
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
