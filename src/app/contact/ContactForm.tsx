"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: "", company: "", email: "", message: "" });
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How long to build?",
      a: "Standard MVPs typically require 8-12 weeks of engineering. Complex enterprise ecosystems are mapped across 6-month cycles with bi-weekly deployment milestones.",
    },
    {
      q: "Ongoing support?",
      a: 'We offer dedicated "Maintenance Sprints" that include security patching, dependency updates, and performance tuning to ensure 99.9% uptime.',
    },
    {
      q: "Scaling existing apps?",
      a: "Our specialty is technical debt remediation and cloud migration. We transition monolithic architectures into scalable microservices without service interruption.",
    },
  ];

  return (
    <>
      {/* ─── Hero Section ─── */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 mb-10 md:mb-24 relative mt-0 md:mt-12 py-16 md:py-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 md:-left-24 w-64 md:w-96 h-64 md:h-96 bg-secondary/10 md:bg-primary/5 rounded-full blur-[100px] md:blur-[120px]"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] md:hidden"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="font-label uppercase tracking-[0.2em] text-[0.6875rem] text-primary mb-4 block md:hidden">Initiate Transmission</span>
          <h1 className="font-headline text-4xl md:text-7xl font-bold text-on-surface tracking-tight md:tracking-tighter leading-tight md:leading-none mb-6 md:mb-8">
            Ready to Start Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Project?
            </span>
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-md md:max-w-2xl font-body">
            We&apos;re here to engineer your next digital breakthrough. Let&apos;s talk about your goals.
          </p>
        </div>
      </section>

      {/* ─── Main Contact Grid ─── */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-start mb-16 md:mb-32">
        {/* Contact Form Card */}
        <div className="lg:col-span-7 glass-panel p-8 md:p-12 rounded-xl border border-outline-variant/20 shadow-[0_0_20px_rgba(0,255,102,0.05)]">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-8 tracking-tight">
            Project Inquiry
          </h2>
          {isSuccess ? (
            <div className="bg-primary/10 border border-primary text-primary p-6 rounded-lg text-center font-headline animate-fade-in">
              <span className="material-symbols-outlined text-4xl mb-2 block mx-auto">check_circle</span>
              Message received. We will calibrate our systems and connect with you shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant">
                    Full Name
                  </label>
                  <input
                    required
                    className="w-full bg-surface-container-highest border-none rounded-sm px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary/30 transition-all outline-none"
                    placeholder="John Doe"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant">
                    Company
                  </label>
                  <input
                    className="w-full bg-surface-container-highest border-none rounded-sm px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary/30 transition-all outline-none"
                    placeholder="Acme Corp"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant">
                  Email Address
                </label>
                <input
                  required
                  className="w-full bg-surface-container-highest border-none rounded-sm px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary/30 transition-all outline-none"
                  placeholder="john@acme.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant">
                  Message
                </label>
                <textarea
                  required
                  className="w-full bg-surface-container-highest border-none rounded-sm px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary/30 transition-all outline-none resize-none"
                  placeholder="Tell us about your technical requirements..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <button
                disabled={isSubmitting}
                className="w-full py-4 bg-tertiary text-on-tertiary-fixed font-headline font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(88,231,171,0.2)] disabled:opacity-50"
                type="submit"
              >
                {isSubmitting ? "TRANSMITTING..." : "SEND MESSAGE"}
              </button>
            </form>
          )}
        </div>

        {/* Contact Details & Map */}
        <div className="lg:col-span-5 space-y-8">
          {/* Details Bento */}
          <div className="grid grid-cols-1 gap-6">
            <div className="glass-panel p-6 rounded-xl border border-outline-variant/10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  location_on
                </span>
              </div>
              <div>
                <h3 className="font-label text-xs uppercase tracking-widest text-primary mb-1">
                  Headquarters
                </h3>
                <p className="text-on-surface font-medium font-body">
                  Bidhannagar, Sector V<br />
                  Kolkata, West Bengal 700091
                </p>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-xl border border-outline-variant/10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  call
                </span>
              </div>
              <div>
                <h3 className="font-label text-xs uppercase tracking-widest text-primary mb-1">
                  Direct Line
                </h3>
                <p className="text-on-surface font-medium font-body">
                  +91 9831968846<br />
                  WhatsApp Available
                </p>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-xl border border-outline-variant/10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  alternate_email
                </span>
              </div>
              <div>
                <h3 className="font-label text-xs uppercase tracking-widest text-primary mb-1">
                  Secure Email
                </h3>
                <p className="text-on-surface font-medium font-body">
                  hello@biznexa.tech<br />
                  encrypted.biznexa.tech
                </p>
              </div>
            </div>
          </div>
          {/* Map Placeholder */}
          <div className="h-64 rounded-xl overflow-hidden relative border border-outline-variant/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <img
              className="w-full h-full object-cover filter grayscale brightness-50 contrast-125"
              alt="stylized dark-themed digital map of Kolkata city with cyan and indigo glowing circuit lines and a prominent light marker over Salt Lake Sector V"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy0ZUdpI_G3YK9fomkN5swiBNMZHIJJ0vGJzAy8P7cLbtqqTIjOXXbbVwoiKJHauIGVwzhjXZM_IwT40w9-x9U8KlL1iKgAbd_rMNoCGyLJQCcPOKv5-aZL2h-IesYEMw8jxYU5_1tTHYRCcYcOddTxcbfhc2BAAd_y_mLYNTSHyVj6nv1cVyDB6Ayeei96QezRnl7at42nBiymBo20jT6xFss0EpKfj7_e2_Bi3F9AQTQ9wbHvYVZnfMyenTOBIkgUwQ6_CLn-c4w"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-primary rounded-full animate-ping absolute"></div>
              <div className="w-4 h-4 bg-primary rounded-full relative"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="max-w-4xl mx-auto px-6 md:px-8 mb-16 md:mb-24">
        <h2 className="font-headline text-xl md:text-3xl font-bold text-on-surface mb-8 md:mb-12 md:text-center tracking-tight">
          Common Inquiries
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-surface-container-low rounded-lg p-6 border border-outline-variant/10">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center text-left group"
              >
                <span className="font-headline font-semibold text-on-surface group-hover:text-primary transition-colors">
                  {faq.q}
                </span>
                <span
                  className={`material-symbols-outlined text-primary transition-transform duration-300 ${
                    openFaq === index ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 font-body ${
                  openFaq === index ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="text-sm leading-relaxed opacity-80 max-w-2xl text-on-surface-variant">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
