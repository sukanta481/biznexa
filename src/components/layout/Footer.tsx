import Link from "next/link";

import { COMPANY, FOOTER_NAV } from "@/lib/constants";
import { getSiteSettings } from "@/lib/site-settings";
import { FooterBackgroundGradient, TextHoverEffect } from "@/components/ui/hover-footer";

import { Mail, Phone, MapPin } from "lucide-react";

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

const SOCIAL_ICON_MAP = {
  whatsapp: WhatsAppIcon,
  linkedin: LinkedInIcon,
  twitter: XIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
} as const;

type SocialKey = keyof typeof SOCIAL_ICON_MAP;

export default async function Footer() {
  const settings = await getSiteSettings();
  const socialLinks = (Object.entries(settings.social) as Array<[SocialKey, string]>).filter(([, href]) => href.trim().length > 0);

  const contactInfo = [
    {
      icon: <Mail size={18} className="text-[#3ca2fa] shrink-0" />,
      text: settings.siteEmail || COMPANY.email,
      href: `mailto:${settings.siteEmail || COMPANY.email}`,
    },
    {
      icon: <Phone size={18} className="text-[#3ca2fa] shrink-0" />,
      text: settings.sitePhone || COMPANY.phone,
      href: `tel:${(settings.sitePhone || COMPANY.phone).replace(/\D/g, "")}`,
    },
    {
      icon: <MapPin size={18} className="text-[#3ca2fa] shrink-0" />,
      text: settings.siteAddress || COMPANY.address.full,
    },
  ];

  return (
    <footer className="bg-[#091328] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 py-14 z-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-12 pb-12">
          {/* Brand Section */}
          <div className="flex flex-col space-y-4">
            <div className="h-8 md:h-10">
              <img
                alt="Biznexa Logo"
                className="h-full w-auto object-contain [filter:drop-shadow(0_0_10px_rgba(0,255,65,0.4))]"
                src="/lightlogo.svg"
              />
            </div>
            <p className="text-sm leading-relaxed text-[#b0b8c8]">
              {COMPANY.description}
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6 font-headline">
              Navigation
            </h4>
            <ul className="space-y-3">
              {FOOTER_NAV.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#b0b8c8] hover:text-[#3ca2fa] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Capabilities Links */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6 font-headline">
              Capabilities
            </h4>
            <ul className="space-y-3">
              {FOOTER_NAV.capabilities.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#b0b8c8] hover:text-[#3ca2fa] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6 font-headline">
              Contact Us
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-start space-x-3">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-[#b0b8c8] hover:text-[#3ca2fa] transition-colors text-sm leading-relaxed"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-[#b0b8c8] hover:text-[#3ca2fa] transition-colors text-sm leading-relaxed">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            {/* Social Icons */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-6">
                {socialLinks.map(([platform, href]) => {
                  const Icon = SOCIAL_ICON_MAP[platform];
                  if (!Icon) return null;

                  return (
                    <a
                      key={platform}
                      className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#3ca2fa]/10 hover:border-[#3ca2fa]/40 transition-all text-[#b0b8c8] hover:text-[#3ca2fa]"
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={platform}
                    >
                      <Icon className="w-4 h-4 fill-current" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <hr className="border-t border-white/10 my-8" />

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
          {/* Legal Links */}
          <div className="flex gap-4">
            {FOOTER_NAV.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#b0b8c8] hover:text-[#3ca2fa] transition-colors text-xs"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-[#b0b8c8] text-xs">
            &copy; {new Date().getFullYear()} {COMPANY.fullName}. All rights reserved.
          </p>
        </div>
      </div>

      {/* Text Hover Effect - Desktop Only */}
      <div className="lg:flex hidden h-[30rem] -mt-52 -mb-36 relative z-10">
        <TextHoverEffect text="Biznexa" className="z-50" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}
