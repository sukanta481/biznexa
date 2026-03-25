"use client";

import { COMPANY } from "@/lib/constants";

export default function WhatsAppButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-6 md:bottom-12 md:right-8 right-6 flex flex-col gap-4 z-[60]">
      <a
        href={COMPANY.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="bg-primary text-on-primary-fixed p-4 rounded-full shadow-[0_0_20px_rgba(0,255,102,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
      >
        <span className="material-symbols-outlined flex text-2xl">chat</span>
      </a>
      <button 
        onClick={scrollToTop}
        className="bg-surface-container-high/80 border border-white/5 backdrop-blur-md text-primary rounded-full p-4 hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl flex items-center justify-center"
        aria-label="Scroll to top"
      >
        <span className="material-symbols-outlined flex text-2xl">expand_less</span>
      </button>
    </nav>
  );
}
