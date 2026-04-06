import Link from "next/link";

import { COMPANY } from "@/lib/constants";

export const metadata = {
  title: "Privacy Policy | Biznexa",
  description: "Privacy policy for Biznexa Digital Solutions Studio. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#091328] text-white">
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 md:px-8 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container border border-primary/20">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield
            </span>
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary">Legal</span>
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
            Privacy Policy
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
            At <strong className="text-white">{COMPANY.name}</strong> ("we", "our", or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">1. Information We Collect</h2>
          <h3 className="text-lg font-semibold text-primary mt-6 mb-3">1.1 Personal Information</h3>
          <p className="text-[#b0b8c8] leading-relaxed">
            We may collect personal information that you voluntarily provide to us, including but not limited to:
          </p>
          <ul className="text-[#b0b8c8] space-y-2 list-disc list-inside">
            <li>Name and contact details (email address, phone number)</li>
            <li>Company name and business address</li>
            <li>GST number and other tax-related information</li>
            <li>Payment and billing information</li>
            <li>Any other information you choose to provide when contacting us or using our services</li>
          </ul>

          <h3 className="text-lg font-semibold text-primary mt-6 mb-3">1.2 Automatically Collected Information</h3>
          <p className="text-[#b0b8c8] leading-relaxed">
            When you visit our website, we may automatically collect certain information, including:
          </p>
          <ul className="text-[#b0b8c8] space-y-2 list-disc list-inside">
            <li>IP address and browser type</li>
            <li>Device information and operating system</li>
            <li>Pages visited and time spent on our website</li>
            <li>Referring website addresses</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">2. How We Use Your Information</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            We use the information we collect for the following purposes:
          </p>
          <ul className="text-[#b0b8c8] space-y-2 list-disc list-inside">
            <li>To provide, operate, and maintain our services</li>
            <li>To process transactions and send related information (invoices, confirmations)</li>
            <li>To communicate with you regarding your inquiries, support requests, or service updates</li>
            <li>To improve our website, services, and user experience</li>
            <li>To send promotional and marketing communications (with your consent)</li>
            <li>To comply with legal obligations and enforce our terms of service</li>
            <li>To detect, prevent, and address technical or security issues</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">3. Sharing Your Information</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          <ul className="text-[#b0b8c8] space-y-2 list-disc list-inside">
            <li><strong className="text-white">Service Providers:</strong> With trusted third-party vendors who assist us in operating our website or providing services, subject to confidentiality agreements</li>
            <li><strong className="text-white">Legal Requirements:</strong> When required by law, regulation, legal process, or governmental request</li>
            <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, with notice to you</li>
            <li><strong className="text-white">Protection:</strong> To protect the rights, property, or safety of {COMPANY.name}, our users, or others</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">4. Data Security</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul className="text-[#b0b8c8] space-y-2 list-disc list-inside">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Secure server infrastructure</li>
          </ul>
          <p className="text-[#b0b8c8] leading-relaxed">
            While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">5. Cookies and Tracking Technologies</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            We use cookies and similar tracking technologies to enhance your experience on our website. Cookies help us:
          </p>
          <ul className="text-[#b0b8c8] space-y-2 list-disc list-inside">
            <li>Remember your preferences and settings</li>
            <li>Understand how you use our website</li>
            <li>Analyze website traffic and performance</li>
            <li>Deliver relevant content and advertisements</li>
          </ul>
          <p className="text-[#b0b8c8] leading-relaxed">
            You can control cookies through your browser settings. Disabling cookies may affect the functionality of certain features on our website.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">6. Your Rights</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            Depending on your location, you may have the following rights regarding your personal information:
          </p>
          <ul className="text-[#b0b8c8] space-y-2 list-disc list-inside">
            <li><strong className="text-white">Access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong className="text-white">Correction:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong className="text-white">Deletion:</strong> Request deletion of your personal data, subject to legal obligations</li>
            <li><strong className="text-white">Portability:</strong> Request transfer of your data in a machine-readable format</li>
            <li><strong className="text-white">Objection:</strong> Object to processing of your data for certain purposes</li>
            <li><strong className="text-white">Withdrawal of Consent:</strong> Withdraw consent at any time where processing is based on consent</li>
          </ul>
          <p className="text-[#b0b8c8] leading-relaxed">
            To exercise any of these rights, please contact us at <a href={`mailto:${COMPANY.email}`} className="text-primary hover:underline">{COMPANY.email}</a>.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">7. Data Retention</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. When your data is no longer needed, we will securely delete or anonymize it.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">8. Third-Party Links</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party services you visit.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">9. Children's Privacy</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected data from a child, we will take steps to delete it promptly.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">10. Changes to This Policy</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of significant changes by posting the updated policy on our website with a revised "Last updated" date. We encourage you to review this policy periodically.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">11. Contact Us</h2>
          <p className="text-[#b0b8c8] leading-relaxed">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
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
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Have questions about your data?</h2>
          <p className="text-[#b0b8c8] mb-8">We're here to help. Reach out to us anytime.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-on-primary-fixed font-headline font-bold py-3 px-8 rounded-full hover:shadow-[0_0_30px_rgba(0,255,65,0.3)] transition-all transform hover:scale-105 text-sm uppercase tracking-widest">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
