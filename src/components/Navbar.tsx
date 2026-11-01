import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageSquare, GraduationCap } from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';

interface NavbarProps {
  onEnquireClick: () => void;
  onOpenWhatsApp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onEnquireClick, onOpenWhatsApp }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Courses', href: '#courses' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'About Us', href: '#about' },
    { label: 'Results', href: '#results' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-white border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Single Element Brand Wordmark */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, '#home')}
            className="flex items-center gap-2.5 text-[#0F1E36] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0F1E36] flex items-center justify-center text-white shadow-sm group-hover:bg-[#1A2E4D] transition-colors">
              <GraduationCap className="w-5 h-5 text-[#FF6B35]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#0F1E36] font-['Plus_Jakarta_Sans'] leading-tight">
                {ACADEMY_CONFIG.name}
              </span>
              <span className="text-[11px] font-medium text-slate-500 tracking-wider uppercase">
                Premier Coaching Institute
              </span>
            </div>
          </a>

          {/* Zone 2: 4-5 Clean Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[15px] font-medium text-slate-600">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="hover:text-[#0F1E36] transition-colors whitespace-nowrap shrink-0 py-1 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6B35] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Zone 3: Actions */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Phone quick call */}
            <a
              href={`tel:${ACADEMY_CONFIG.phoneNumberRaw}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors whitespace-nowrap"
              title="Call Academic Desk"
            >
              <Phone className="w-3.5 h-3.5 text-[#0F1E36]" />
              <span>{ACADEMY_CONFIG.phoneDisplay}</span>
            </a>

            {/* WhatsApp CTA */}
            <button
              onClick={onOpenWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors whitespace-nowrap"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onEnquireClick}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#FF6B35] to-[#FA8A3C] hover:from-[#E8551F] hover:to-[#FF6B35] rounded-lg shadow-sm hover:shadow transition-all duration-150 whitespace-nowrap"
            >
              Enquire Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onEnquireClick}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#FF6B35] rounded-md sm:hidden"
            >
              Enquire
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-[#0F1E36] hover:bg-slate-100 transition-colors"
              aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl transition-all duration-200 animate-in slide-in-from-top-2">
          <div className="max-w-7xl mx-auto px-4 pt-3 pb-6 space-y-3">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-[#0F1E36] hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onEnquireClick();
                }}
                className="w-full py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-[#FF6B35] to-[#FA8A3C] rounded-lg shadow-sm"
              >
                Enquire Now / Book Free Demo
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${ACADEMY_CONFIG.phoneNumberRaw}`}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100"
                >
                  <Phone className="w-4 h-4 text-[#0F1E36]" />
                  <span>Call Us</span>
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenWhatsApp();
                  }}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
