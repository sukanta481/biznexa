import Link from "next/link";

import { COMPANY, FOOTER_NAV } from "@/lib/constants";
import { getSiteSettings } from "@/lib/site-settings";

interface SocialIconProps {
  className?: string;
}

function WhatsAppIcon({ className }: SocialIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.16 1.6 5.98L0 24l6.3-1.65a11.8 11.8 0 0 0 5.76 1.47h.01c6.55 0 11.9-5.34 11.9-11.91 0-3.18-1.24-6.17-3.45-8.43Zm-8.46 18.33h-.01a9.84 9.84 0 0 1-5.01-1.37l-.36-.22-3.74.98 1-3.65-.24-.37a9.82 9.82 0 0 1-1.52-5.27c0-5.43 4.42-9.85 9.87-9.85 2.63 0 5.09 1.02 6.94 2.88a9.78 9.78 0 0 1 2.89 6.97c0 5.44-4.43 9.86-9.82 9.86Zm5.4-7.39c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.28-.47-2.44-1.5-.9-.8-1.51-1.78-1.69-2.08-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.61-.92-2.21-.24-.57-.49-.49-.68-.5h-.58c-.2 0-.53.08-.81.38-.28.3-1.07 1.05-1.07 2.56 0 1.5 1.1 2.96 1.25 3.16.15.2 2.13 3.26 5.15 4.56.72.31 1.28.49 1.72.62.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.44.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: SocialIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5ZM8 19H5V9h3v10ZM6.5 7.73a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5ZM19 19h-3v-5.4c0-3.23-4-2.99-4 0V19H9V9h3v1.6c1.4-2.58 7-2.77 7 2.37V19Z" />
    </svg>
  );
}

function XIcon({ className }: SocialIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-6.42L6.43 22H3.33l7.24-8.28L.8 2h6.4l4.43 5.84L18.9 2Zm-1.1 18h1.73L6.26 3.9H4.4L17.8 20Z" />
    </svg>
  );
}

function FacebookIcon({ className }: SocialIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12a12 12 0 1 0-13.88 11.85v-8.39H7.08V12h3.04V9.36c0-3 1.8-4.66 4.54-4.66 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.46h-2.79v8.39A12 12 0 0 0 24 12Z" />
    </svg>
  );
}

function InstagramIcon({ className }: SocialIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm8.5 1.8h-8.5A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95ZM12 7.35A4.65 4.65 0 1 1 7.35 12 4.65 4.65 0 0 1 12 7.35Zm0 1.8A2.85 2.85 0 1 0 14.85 12 2.85 2.85 0 0 0 12 9.15Zm4.9-2.9a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z" />
    </svg>
  );
}

function YouTubeIcon({ className }: SocialIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.11-2.12C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.39.58A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.12C4.5 20.5 12 20.5 12 20.5s7.5 0 9.39-.58a3 3 0 0 0 2.11-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.69V8.31L15.85 12 9.6 15.69Z" />
    </svg>
  );
}

function GitHubIcon({ className }: SocialIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.82-.26.82-.58v-2.04c-3.34.73-4.04-1.41-4.04-1.41-.55-1.37-1.33-1.73-1.33-1.73-1.09-.74.08-.72.08-.72 1.2.09 1.84 1.23 1.84 1.23 1.08 1.83 2.82 1.3 3.5 1 .11-.76.42-1.3.77-1.6-2.67-.3-5.47-1.31-5.47-5.86 0-1.3.47-2.37 1.23-3.2-.12-.3-.53-1.55.12-3.22 0 0 1-.32 3.3 1.22a11.6 11.6 0 0 1 6 0c2.3-1.54 3.3-1.22 3.3-1.22.65 1.67.24 2.92.12 3.22.77.83 1.23 1.9 1.23 3.2 0 4.56-2.8 5.56-5.48 5.85.43.36.82 1.09.82 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function TelegramIcon({ className }: SocialIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.94 4.64a1.5 1.5 0 0 0-1.7-.24L2.3 11.86a1.5 1.5 0 0 0 .16 2.82l4.39 1.45 1.62 5.19a1.5 1.5 0 0 0 2.56.58l2.45-2.5 4.8 3.56a1.5 1.5 0 0 0 2.36-.9l3.2-15.8a1.5 1.5 0 0 0-.9-1.62ZM8.03 15.42l9.85-6.04-7.4 7.55-.34 1.87-2.11-3.38Zm3.56 2.85.4-2.2 1.54 1.14-1.94 1.06Z" />
    </svg>
  );
}

const SOCIAL_ICON_MAP = {
  whatsapp: WhatsAppIcon,
  linkedin: LinkedInIcon,
  twitter: XIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  github: GitHubIcon,
  telegram: TelegramIcon,
} as const;

type SocialKey = keyof typeof SOCIAL_ICON_MAP;

export default async function Footer() {
  const settings = await getSiteSettings();
  const socialLinks = (Object.entries(settings.social) as Array<[SocialKey, string]>).filter(([, href]) => href.trim().length > 0);

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
            
            {socialLinks.length > 0 ? (
              <div className="hidden md:flex gap-4">
                {socialLinks.map(([platform, href]) => {
                  const Icon = SOCIAL_ICON_MAP[platform];

                  return (
                    <a
                      key={platform}
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary/10 hover:border-primary/40 transition-all text-on-surface-variant hover:text-primary"
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={platform}
                    >
                      <Icon className="w-[18px] h-[18px] fill-current" />
                    </a>
                  );
                })}
              </div>
            ) : null}
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
