"use client";

import ChatbotWidget from "@/components/layout/ChatbotWidget";
import { COMPANY } from "@/lib/constants";

export default function WhatsAppButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-6 md:bottom-12 md:right-8 right-6 flex flex-col gap-4 z-[60]">
      <ChatbotWidget />
      <a
        href={COMPANY.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="bg-[#25D366] text-white p-3.5 rounded-full shadow-[0_0_25px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
      >
        <svg className="w-6 h-6 md:w-7 md:h-7 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.012 0C5.38 0 0 5.378 0 12.01c0 2.12.553 4.194 1.603 6.012L0 24l6.17-1.618A11.96 11.96 0 0 0 12.012 24C18.642 24 24 18.62 24 11.988 24 5.356 18.64 0 12.012 0zm.006 22.003h-.008a9.98 9.98 0 0 1-5.093-1.397l-.365-.218-3.674.963.98-3.582-.238-.378a9.94 9.94 0 0 1-1.527-5.38C2.093 6.536 6.542 2.087 12.018 2.087c2.65 0 5.14 1.033 7.013 2.908a9.89 9.89 0 0 1 2.9 7.009c0 5.48-4.448 9.999-9.913 9.999zm5.438-7.48c-.298-.15-1.763-.87-2.036-.97-.272-.1-.47-.15-.668.15-.198.298-.768.97-.94 1.168-.174.198-.348.223-.646.075-.298-.15-1.26-.464-2.4-1.48-.888-.79-1.488-1.767-1.662-2.065-.174-.298-.018-.46.13-.608.134-.134.298-.348.447-.52.15-.174.198-.298.298-.496.1-.198.05-.372-.025-.52-.074-.15-.668-1.611-.916-2.207-.242-.579-.487-.5-.668-.51h-.57-.001c-.198 0-.52.075-.793.372s-1.04 1.016-1.04 2.479c0 1.463 1.065 2.875 1.213 3.073.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.711.226 1.358.194 1.87.117.571-.085 1.763-.719 2.011-1.413.248-.694.248-1.289.174-1.413-.075-.124-.273-.198-.571-.348z" />
        </svg>
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
