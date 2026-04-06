"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="group relative inline-block overflow-hidden"
    style={{ height: '1.25rem' }}
  >
    <div
      className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2"
      style={{ height: '2.5rem' }}
    >
      <span className="flex items-center text-[13px] font-medium tracking-widest text-gray-400 whitespace-nowrap uppercase" style={{ height: '1.25rem' }}>
        {children}
      </span>
      <span className="flex items-center text-[13px] font-medium tracking-widest text-green-500 whitespace-nowrap uppercase" style={{ height: '1.25rem' }}>
        {children}
      </span>
    </div>
  </Link>
);

export function BiznexaNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [shapeClass, setShapeClass] = useState('rounded-full');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isOpen) {
      setShapeClass('rounded-xl');
    } else {
      timerRef.current = setTimeout(() => setShapeClass('rounded-full'), 300);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Blogs', href: '/blog' },
  ];

  return (
    <header
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center
        px-7 py-3.5 backdrop-blur-md
        border border-green-500/20 bg-[rgba(13,15,18,0.72)]
        w-[calc(100%-2rem)] max-w-5xl
        transition-[border-radius] duration-300 ${shapeClass}`}
    >
      <div className="flex items-center w-full gap-0">
        {/* Logo */}
        <Link href="/" className="flex flex-col gap-0.5 min-w-[140px]">
          <div className="text-xl font-bold text-white tracking-tight">
            <span className="text-green-500">B</span>iznexa
          </div>
          <div className="text-[9px] font-semibold tracking-[0.14em] text-green-500">
            Websites · AI Automation · Digital Marketing
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 flex-1 justify-center">
          {navLinks.map(link => (
            <AnimatedNavLink key={link.href} href={link.href}>{link.label}</AnimatedNavLink>
          ))}
        </nav>

        {/* Contact Button */}
        <Link href="/contact" className="hidden md:block px-5 py-2.5 text-[13px] font-bold tracking-wider text-black bg-green-500 rounded-lg hover:bg-green-600 transition-all duration-200 hover:scale-103 active:scale-97">
          Contact
        </Link>

        {/* Mobile Toggle */}
        <button
          className="md:hidden ml-auto text-gray-400 p-1"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen
            ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          }
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden flex flex-col items-center w-full overflow-hidden transition-all ease-in-out duration-300
        ${isOpen ? 'max-h-[400px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center gap-4 w-full">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-gray-400 hover:text-green-500 transition-colors text-base font-medium uppercase tracking-widest" onClick={() => setIsOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="mt-4 w-full py-2.5 text-sm font-bold tracking-wider text-black bg-green-500 rounded-lg hover:bg-green-600 transition-colors text-center" onClick={() => setIsOpen(false)}>
          Contact
        </Link>
      </div>
    </header>
  );
}
