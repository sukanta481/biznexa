"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 w-full z-50 backdrop-blur-xl transition-all duration-300 border-b border-white/5 ${
        isScrolled ? "nav-scrolled" : "bg-slate-950/40"
      }`}
      id="main-nav"
    >
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <div className="flex flex-col">
          <Link href="/" onClick={closeMenu} className="h-8 md:h-9 block">
            <img
              alt="Biznexa Logo"
              className="h-full w-auto object-contain [filter:drop-shadow(0_0_8px_rgba(0,255,65,0.5))]"
              src="/lightlogo.svg"
            />
          </Link>
          <span className="text-[8px] uppercase tracking-[0.3em] text-primary mt-1 font-label font-bold hidden md:block">
            Websites · AI Automation · Digital Marketing
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "About", href: "/about" },
            { label: "Case Studies", href: "/case-studies" },
            { label: "Blogs", href: "/blog" },
          ].map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-label uppercase tracking-widest text-xs transition-colors ${
                  isActive
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Toggle & CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="hidden sm:block bg-primary text-on-primary-fixed px-6 py-2 rounded-lg font-headline font-bold uppercase tracking-widest text-sm hover:scale-95 transition-all duration-200"
          >
            CONTACT
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-primary focus:outline-none flex items-center justify-center p-2"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-cyber-border py-4 px-8 flex flex-col gap-4 shadow-xl">
          {[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "About", href: "/about" },
            { label: "Case Studies", href: "/case-studies" },
            { label: "Blogs", href: "/blog" },
            { label: "Contact", href: "/contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={`font-label uppercase tracking-widest text-sm py-2 ${
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href))
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
