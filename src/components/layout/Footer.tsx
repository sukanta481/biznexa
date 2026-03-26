import Link from "next/link";
import { COMPANY, FOOTER_NAV } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[#091328] md:bg-background w-full md:border-t md:border-white/10 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent hidden md:block"></div>
      
      <div className="max-w-7xl mx-auto px-8 py-12 md:py-20 flex flex-col md:block gap-10 md:gap-0 border-t border-white/10 md:border-none">
        <div className="flex flex-col md:grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 lg:gap-24">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col gap-6 md:space-y-8">
            <div className="h-8 md:h-10">
              <img
                alt="Biznexa Logo"
                className="h-full w-auto object-contain [filter:drop-shadow(0_0_10px_rgba(0,255,65,0.4))]"
                src="/lightlogo.svg"
              />
            </div>
            <p className="font-body font-light text-[#b0b8c8] text-sm md:text-base leading-relaxed md:max-w-sm">
              {COMPANY.description}
            </p>
            
            <div className="hidden md:flex gap-4">
              <a
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary/10 hover:border-primary/40 transition-all text-on-surface-variant group"
                href={`https://wa.me/${COMPANY.phone.replace(/[\s+]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  alt="WhatsApp"
                  className="w-5 h-5 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8ppuzdwIHxUBZFwZtvnmDnQWsYOAXiKg6ERUIwLsavL7-fBNcI3FbkOjfRc_G_d-qYbHm5M5FzD8fisbIkfdHUassEBg9AHFQLdwxqCi2fMUBtRV2ZEZiMPKmKwYt-oiVAU3hS2ihfHUn_r4a1z7RatbM-YhR090s8qENRn3BY_SmlUDzv9cRC2Rnn0Y7vUIoGVG12lrHXfgxByih9B1Mst7_M7hw6SWvgboJHuuc-pH8AWDgFOv2qSbicu9TTRC0ZKQk34tlQEUa"
                />
              </a>
              <a
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary/10 hover:border-primary/40 transition-all text-on-surface-variant hover:text-primary"
                href={COMPANY.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary/10 hover:border-primary/40 transition-all text-on-surface-variant hover:text-primary"
                href={COMPANY.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4 md:block">
              <h5 className="font-headline font-bold text-white mb-0 md:mb-8 uppercase md:tracking-[0.2em] tracking-widest text-[10px] md:text-xs">
                Navigation
              </h5>
              
              <div className="flex flex-col gap-4 md:hidden">
                {FOOTER_NAV.navigation.map((link) => (
                  <Link key={link.href} href={link.href} className="text-[#b0b8c8] text-xs">
                    {link.label}
                  </Link>
                ))}
              </div>
              
              <ul className="hidden md:block space-y-4">
                {FOOTER_NAV.navigation.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#b0b8c8] hover:text-primary transition-colors font-body text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col gap-4 md:block">
              <h5 className="font-headline font-bold text-white mb-0 md:mb-8 uppercase md:tracking-[0.2em] tracking-widest text-[10px] md:text-xs">
                Capabilities
              </h5>
              
              <div className="flex flex-col gap-4 md:hidden">
                {FOOTER_NAV.capabilities.map((link) => (
                  <Link key={link.href} href={link.href} className="text-[#b0b8c8] text-xs">
                    {link.label}
                  </Link>
                ))}
              </div>
              
              <ul className="hidden md:block space-y-4">
                {FOOTER_NAV.capabilities.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#b0b8c8] hover:text-primary transition-colors font-body text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="hidden sm:block col-span-2 sm:col-span-1">
              <h5 className="font-headline font-bold text-white mb-8 uppercase tracking-[0.2em] text-xs">
                Offices
              </h5>
              <p className="text-[#b0b8c8] font-body text-sm leading-relaxed mb-4">
                {COMPANY.address.street}
                <br />
                {COMPANY.address.city}, {COMPANY.address.state}
              </p>
              <p className="text-[#b0b8c8] font-body text-xs leading-relaxed opacity-60">
                Support: {COMPANY.phone}
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                {FOOTER_NAV.legal.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white hover:text-primary transition-colors text-[10px] font-label uppercase tracking-widest border-b border-white/10"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Mobile bottom bar (T&C) */}
        <div className="md:hidden pt-8 border-t border-white/5 flex flex-col gap-6">
          <div className="flex gap-4">
            <Link href="/privacy" className="text-white hover:text-primary transition-colors text-[10px] font-label uppercase tracking-widest">Privacy</Link>
            <Link href="/terms" className="text-white hover:text-primary transition-colors text-[10px] font-label uppercase tracking-widest">Terms</Link>
          </div>
          <p className="text-[#b0b8c8] text-[10px] font-body uppercase tracking-tighter opacity-60">© {new Date().getFullYear()} BIZNEXA DIGITAL SOLUTIONS STUDIO.</p>
        </div>
      </div>

      {/* Desktop Bottom Footer Bar */}
      <div className="hidden md:block border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[#b0b8c8] text-xs font-body font-light text-center md:text-left">
            © {new Date().getFullYear()} {COMPANY.fullName}. All rights reserved. Architected with precision.
          </div>
          
          <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full border border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-primary font-medium font-headline text-[10px] tracking-widest uppercase">
                System Operational
              </span>
            </div>
            <div className="w-px h-3 bg-white/10"></div>
            <span className="text-[#b0b8c8] text-[10px] font-label uppercase tracking-widest">
              Global Node: 0x1-KOL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
