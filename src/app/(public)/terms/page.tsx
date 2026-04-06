import Link from "next/link";

import { COMPANY } from "@/lib/constants";

export const metadata = {
  title: "Terms & Conditions | Biznexa",
  description: "Terms and conditions for using Biznexa Digital Solutions Studio services and website.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#091328] text-white">
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 md:px-8 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container border border-secondary/20">
            <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              gavel
            </span>
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">Legal</span>
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
            Terms & Conditions
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto">
            Last updated: January 1, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-[#b0b8c8] leading-relaxed">
            Welcome to <strong className="text-white">{COMPANY.name}</strong>. By accessing or using our website and services, you agree to be bound by these Terms & Conditions. Please read them carefully before using our services.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">1. Acceptance of Terms</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            By accessing, browsing, or using our website ({COMPANY.website}) or any of our services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use our website or services.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">2. Services</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            {COMPANY.name} provides digital solutions including but not limited to:
          </p>
          <ul className="text-[#b0b8c8] space-y-2 list-disc list-inside">
            <li>Custom web development and design</li>
            <li>AI and workflow automation solutions</li>
            <li>UI/UX design services</li>
            <li>Digital marketing and SEO services</li>
            <li>API integration and consulting</li>
          </ul>
          <p className="text-[#b0b8c8] leading-relaxed">
            The scope, deliverables, timelines, and pricing for each project will be defined in a separate agreement or statement of work.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">3. Eligibility</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            You must be at least 18 years old and have the legal capacity to enter into a binding agreement to use our services. By using our services, you represent and warrant that you meet these requirements.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">4. User Accounts</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            Certain features of our website may require you to create an account. You are responsible for:
          </p>
          <ul className="text-[#b0b8c8] space-y-2 list-disc list-inside">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized access or security breach</li>
          </ul>
          <p className="text-[#b0b8c8] leading-relaxed">
            We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent or abusive behavior.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">5. Intellectual Property</h2>
          <h3 className="text-lg font-semibold text-primary mt-6 mb-3">5.1 Our Content</h3>
          <p className="text-[#b0b8c8] leading-relaxed">
            All content on our website, including text, graphics, logos, images, software, and code, is the property of {COMPANY.name} or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written consent.
          </p>

          <h3 className="text-lg font-semibold text-primary mt-6 mb-3">5.2 Client Work</h3>
          <p className="text-[#b0b8c8] leading-relaxed">
            Upon full payment, ownership of custom-developed deliverables will be transferred to the client as specified in the project agreement. We reserve the right to showcase completed work in our portfolio unless otherwise agreed in writing.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">6. Payment Terms</h2>
          <ul className="text-[#b0b8c8] space-y-2 list-disc list-inside">
            <li>Payment terms will be specified in the project agreement or invoice</li>
            <li>Invoices are due within the timeframe specified (typically 15 days from the invoice date)</li>
            <li>Late payments may be subject to additional fees as outlined in the agreement</li>
            <li>We accept payments via bank transfer, UPI, and other methods as specified</li>
            <li>All fees are non-refundable unless otherwise stated in writing</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">7. Project Timelines and Deliverables</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            Project timelines are estimates based on the scope defined at the start of the engagement. Delays may occur due to:
          </p>
          <ul className="text-[#b0b8c8] space-y-2 list-disc list-inside">
            <li>Client delays in providing feedback, content, or approvals</li>
            <li>Changes to the project scope (scope creep)</li>
            <li>Technical challenges or third-party dependencies</li>
            <li>Force majeure events</li>
          </ul>
          <p className="text-[#b0b8c8] leading-relaxed">
            We will communicate any delays promptly and work with you to adjust timelines accordingly.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">8. Limitation of Liability</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            To the maximum extent permitted by law, {COMPANY.name} shall not be liable for:
          </p>
          <ul className="text-[#b0b8c8] space-y-2 list-disc list-inside">
            <li>Indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, revenue, data, or business opportunities</li>
            <li>Any damages arising from your use of or inability to use our services</li>
          </ul>
          <p className="text-[#b0b8c8] leading-relaxed">
            Our total liability shall not exceed the amount paid by you for the specific service giving rise to the claim.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">9. Indemnification</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            You agree to indemnify and hold harmless {COMPANY.name}, its officers, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of:
          </p>
          <ul className="text-[#b0b8c8] space-y-2 list-disc list-inside">
            <li>Your use of our services or website</li>
            <li>Your violation of these Terms & Conditions</li>
            <li>Your violation of any third-party rights</li>
            <li>Content or materials you provide to us</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">10. Confidentiality</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            Both parties agree to maintain the confidentiality of any proprietary or sensitive information shared during the course of the engagement. This obligation survives the termination of the agreement.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">11. Termination</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            Either party may terminate a project agreement as per the terms specified in that agreement. Upon termination:
          </p>
          <ul className="text-[#b0b8c8] space-y-2 list-disc list-inside">
            <li>You shall pay for all work completed up to the termination date</li>
            <li>We will deliver completed work and materials as specified in the agreement</li>
            <li>Confidentiality obligations will continue to apply</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">12. Third-Party Services</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            Our services may integrate with or rely on third-party platforms, APIs, or tools. We are not responsible for the availability, performance, or terms of these third-party services. Your use of third-party services is subject to their respective terms and policies.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">13. Governing Law</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Kolkata, West Bengal, India.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">14. Changes to Terms</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            We reserve the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after changes constitutes acceptance of the revised terms.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">15. Contact Information</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            If you have any questions about these Terms & Conditions, please contact us:
          </p>
          <div className="bg-[#1e293b]/40 border border-white/5 rounded-xl p-6 mt-4 space-y-3">
            <p className="text-white font-semibold">{COMPANY.name}</p>
            <p className="text-[#b0b8c8] text-sm">{COMPANY.address.full}</p>
            <p className="text-[#b0b8c8] text-sm">
              Email: <a href={`mailto:${COMPANY.email}`} className="text-primary hover:underline">{COMPANY.email}</a>
            </p>
            <p className="text-[#b0b8c8] text-sm">
              Phone: <a href={`tel:${COMPANY.phone.replace(/\D/g, "")}`} className="text-primary hover:underline">{COMPANY.phone}</a>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 py-16 px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-[#b0b8c8] mb-8">Let&#39;s discuss your project and build something amazing together.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-on-primary-fixed font-headline font-bold py-3 px-8 rounded-full hover:shadow-[0_0_30px_rgba(0,255,65,0.3)] transition-all transform hover:scale-105 text-sm uppercase tracking-widest">
            Book a Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
