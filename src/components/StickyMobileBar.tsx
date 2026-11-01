import React from 'react';
import { Phone, MessageSquare, BookOpen } from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';

interface StickyMobileBarProps {
  onEnquireClick: () => void;
  onWhatsAppClick: () => void;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({
  onEnquireClick,
  onWhatsAppClick,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-3 gap-2">
        {/* Call Button */}
        <a
          href={`tel:${ACADEMY_CONFIG.phoneNumberRaw}`}
          className="flex items-center justify-center gap-1.5 py-2 px-2 text-[11px] font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-[#0F1E36]" />
          <span>Call</span>
        </a>

        {/* WhatsApp Button */}
        <button
          type="button"
          onClick={onWhatsAppClick}
          className="flex items-center justify-center gap-1.5 py-2 px-2 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </button>

        {/* Enquire CTA */}
        <button
          type="button"
          onClick={onEnquireClick}
          className="flex items-center justify-center gap-1.5 py-2 px-2 text-[11px] font-bold text-white bg-gradient-to-r from-[#FF6B35] to-[#FA8A3C] rounded-lg shadow-xs"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Enquire</span>
        </button>
      </div>
    </div>
  );
};
