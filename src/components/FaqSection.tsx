import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 bg-[#F8FAFC] border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF6B35] mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1E36] tracking-tight font-['Plus_Jakarta_Sans']">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Clear answers to help you make an informed decision for your child's education.
          </p>
        </div>

        <div className="space-y-3">
          {ACADEMY_CONFIG.faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-[#0F1E36] hover:text-[#FF6B35] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-['Plus_Jakarta_Sans']">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-[#FF6B35]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-0 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
