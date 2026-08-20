import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import { COMPANY } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";
import { BreadcrumbSchema, FAQSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = pageMeta({
  title: "Contact BizNexa — Start Your Project",
  description:
    "Ready to start your project? Get in touch with BizNexa for a free consultation on web development, AI automation, UI/UX design and digital marketing.",
  path: "/contact",
});

const faqData = [
  {
    question: "What is your typical project timeline?",
    answer: "Most projects take 4-8 weeks from kickoff to launch, depending on complexity.",
  },
  {
    question: "Do you work with international clients?",
    answer: "Absolutely! We work with clients worldwide and accommodate different time zones.",
  },
  {
    question: "What technologies do you specialize in?",
    answer: "We specialize in React, Next.js, Node.js, Python, and various AI/ML frameworks.",
  },
  {
    question: "How do you price your projects?",
    answer: "We offer both project-based and retainer pricing. Every project starts with a free consultation.",
  },
  {
    question: "Do you provide ongoing support after launch?",
    answer: "Yes, we offer maintenance and support packages after launch.",
  },
];

export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: COMPANY.website },
          { name: "Contact", url: `${COMPANY.website}/contact` },
        ]}
      />
      <FAQSchema faqs={faqData} />
      <ContactForm />
    </>
  );
}
