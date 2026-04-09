'use client';

import { useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { useRouter } from "next/navigation";

import type { HomepageContent } from "@/lib/homepage";

interface HomepageContentClientProps {
  initialContent: HomepageContent;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-sm font-headline font-bold text-primary uppercase tracking-[0.25em]">{children}</h2>;
}

function Label({ children }: { children: ReactNode }) {
  return <label className="block font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{children}</label>;
}

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full bg-slate-950/80 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20 transition-all ${props.className ?? ""}`} />;
}

function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full bg-slate-950/80 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20 transition-all ${props.className ?? ""}`} />;
}

function ImageField({
  label,
  value,
  onChange,
  onUpload,
  isUploading,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{label} URL</Label>
        <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder="https://... or /uploads/..." />
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-slate-950/50 p-4">
        <label className="inline-flex w-fit cursor-pointer rounded-lg border border-primary/20 bg-primary/10 px-4 py-2 text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-primary transition hover:bg-primary/15">
          {isUploading ? "Uploading..." : "Upload File"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }

              await onUpload(file);
              event.currentTarget.value = "";
            }}
          />
        </label>
        {value ? (
          <div className="overflow-hidden rounded-lg border border-white/10 bg-black/20">
            <img src={value} alt={label} className="h-40 w-full object-cover" />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-white/10 px-4 py-6 text-center text-xs text-slate-500">
            No image selected yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomepageContentClient({ initialContent }: HomepageContentClientProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateSection<K extends keyof HomepageContent>(section: K, value: HomepageContent[K]) {
    setContent((current) => ({ ...current, [section]: value }));
  }

  async function uploadImage(fieldKey: string, file: File) {
    setUploadingField(fieldKey);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Upload failed.");
      }

      return result.url as string;
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Upload failed.";
      setError(message);
      throw uploadError;
    } finally {
      setUploadingField("");
    }
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/content/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Unable to save homepage content.");
      }

      setMessage("Homepage content synced successfully.");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save homepage content.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-5xl font-headline font-bold text-white tracking-tight leading-tight">Manage Homepage Content</h1>
          <p className="text-slate-400 mt-3 max-w-2xl font-body text-sm leading-relaxed opacity-70">
            This editor now follows the live homepage layout exactly: hero, stats, services, global reach, testimonials, FAQ, and CTA.
          </p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => router.refresh()} className="px-6 py-3 bg-[#192540]/30 backdrop-blur-lg border border-white/[0.08] rounded-lg text-slate-300 font-headline text-[10px] uppercase tracking-[0.2em] hover:bg-[#192540]/50 transition-all">
            Reload Data
          </button>
          <button onClick={handleSave} disabled={isSaving} className="px-8 py-3 bg-gradient-to-r from-emerald-500/80 to-emerald-400/80 text-black font-headline text-[10px] uppercase tracking-[0.2em] font-bold rounded-lg shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/10 transition-all disabled:opacity-70">
            {isSaving ? "Saving..." : "Publish Changes"}
          </button>
        </div>
      </div>

      {(message || error) && (
        <div className={`mb-8 rounded-xl border px-4 py-3 text-sm ${error ? "border-rose-500/30 bg-rose-500/10 text-rose-200" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"}`}>
          {error || message}
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 bg-[#0f172a]/40 backdrop-blur-[24px] border border-white/5 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary">rocket_launch</span>
            <SectionTitle>Hero Section</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><Label>Badge Text</Label><Input value={content.hero.badgeText} onChange={(event) => updateSection("hero", { ...content.hero, badgeText: event.target.value })} /></div>
            <div className="space-y-2"><Label>Lead Text</Label><Input value={content.hero.leadText} onChange={(event) => updateSection("hero", { ...content.hero, leadText: event.target.value })} /></div>
            <div className="space-y-2"><Label>Accent Text</Label><Input value={content.hero.accentText} onChange={(event) => updateSection("hero", { ...content.hero, accentText: event.target.value })} /></div>
            <div className="space-y-2"><Label>Primary CTA Label</Label><Input value={content.hero.primaryCtaLabel} onChange={(event) => updateSection("hero", { ...content.hero, primaryCtaLabel: event.target.value })} /></div>
            <div className="space-y-2"><Label>Primary CTA Link</Label><Input value={content.hero.primaryCtaHref} onChange={(event) => updateSection("hero", { ...content.hero, primaryCtaHref: event.target.value })} /></div>
            <div className="space-y-2"><Label>Secondary CTA Label</Label><Input value={content.hero.secondaryCtaLabel} onChange={(event) => updateSection("hero", { ...content.hero, secondaryCtaLabel: event.target.value })} /></div>
            <div className="space-y-2"><Label>Secondary CTA Link</Label><Input value={content.hero.secondaryCtaHref} onChange={(event) => updateSection("hero", { ...content.hero, secondaryCtaHref: event.target.value })} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Hero Description</Label><Textarea rows={3} value={content.hero.description} onChange={(event) => updateSection("hero", { ...content.hero, description: event.target.value })} /></div>
          </div>
        </section>

        <section className="col-span-12 bg-[#0f172a]/40 backdrop-blur-[24px] border border-white/5 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary">analytics</span>
            <SectionTitle>Stats Section</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {content.stats.map((stat, index) => (
              <div key={index} className="rounded-xl border border-white/10 bg-slate-950/60 p-4 space-y-3">
                <div className="space-y-2"><Label>Value</Label><Input value={stat.value} onChange={(event) => updateSection("stats", content.stats.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item))} /></div>
                <div className="space-y-2"><Label>Label</Label><Input value={stat.label} onChange={(event) => updateSection("stats", content.stats.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item))} /></div>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-12 bg-[#0f172a]/40 backdrop-blur-[24px] border border-white/5 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary">grid_view</span>
            <SectionTitle>Core Services</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2"><Label>Section Heading</Label><Input value={content.servicesIntro.heading} onChange={(event) => updateSection("servicesIntro", { ...content.servicesIntro, heading: event.target.value })} /></div>
            <div className="space-y-2"><Label>Section Description</Label><Textarea rows={3} value={content.servicesIntro.description} onChange={(event) => updateSection("servicesIntro", { ...content.servicesIntro, description: event.target.value })} /></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {content.services.map((service, index) => (
              <div key={index} className="rounded-xl border border-white/10 bg-slate-950/60 p-5 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Eyebrow</Label><Input value={service.eyebrow} onChange={(event) => updateSection("services", content.services.map((item, itemIndex) => itemIndex === index ? { ...item, eyebrow: event.target.value } : item))} /></div>
                  <div className="space-y-2"><Label>Icon</Label><Input value={service.icon} onChange={(event) => updateSection("services", content.services.map((item, itemIndex) => itemIndex === index ? { ...item, icon: event.target.value } : item))} /></div>
                </div>
                <div className="space-y-2"><Label>Title</Label><Input value={service.title} onChange={(event) => updateSection("services", content.services.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))} /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea rows={3} value={service.description} onChange={(event) => updateSection("services", content.services.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item))} /></div>
                <ImageField
                  label="Background Image"
                  value={service.imageUrl ?? ""}
                  isUploading={uploadingField === `service-image-${index}`}
                  onChange={(value) => updateSection("services", content.services.map((item, itemIndex) => itemIndex === index ? { ...item, imageUrl: value || null } : item))}
                  onUpload={async (file) => {
                    const url = await uploadImage(`service-image-${index}`, file);
                    updateSection("services", content.services.map((item, itemIndex) => itemIndex === index ? { ...item, imageUrl: url } : item));
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-12 lg:col-span-5 bg-[#0f172a]/40 backdrop-blur-[24px] border border-white/5 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary">public</span>
            <SectionTitle>Global Reach</SectionTitle>
          </div>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Heading</Label><Input value={content.globalReach.heading} onChange={(event) => updateSection("globalReach", { ...content.globalReach, heading: event.target.value })} /></div>
            <ImageField
              label="Background Image"
              value={content.globalReach.backgroundImage}
              isUploading={uploadingField === "global-background"}
              onChange={(value) => updateSection("globalReach", { ...content.globalReach, backgroundImage: value })}
              onUpload={async (file) => {
                const url = await uploadImage("global-background", file);
                updateSection("globalReach", { ...content.globalReach, backgroundImage: url });
              }}
            />
            {content.globalReach.markers.map((marker, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Marker Icon</Label><Input value={marker.icon} onChange={(event) => updateSection("globalReach", { ...content.globalReach, markers: content.globalReach.markers.map((item, itemIndex) => itemIndex === index ? { ...item, icon: event.target.value } : item) })} /></div>
                <div className="space-y-2"><Label>Marker Label</Label><Input value={marker.label} onChange={(event) => updateSection("globalReach", { ...content.globalReach, markers: content.globalReach.markers.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item) })} /></div>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-12 lg:col-span-7 bg-[#0f172a]/40 backdrop-blur-[24px] border border-white/5 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary">format_quote</span>
            <SectionTitle>Testimonials</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2"><Label>Section Heading</Label><Input value={content.testimonialsIntro.heading} onChange={(event) => updateSection("testimonialsIntro", { ...content.testimonialsIntro, heading: event.target.value })} /></div>
            <div className="space-y-2"><Label>Mobile Description</Label><Input value={content.testimonialsIntro.mobileDescription} onChange={(event) => updateSection("testimonialsIntro", { ...content.testimonialsIntro, mobileDescription: event.target.value })} /></div>
          </div>
          <div className="space-y-4">
            {content.testimonials.map((testimonial, index) => (
              <div key={index} className="rounded-xl border border-white/10 bg-slate-950/60 p-5 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>Initials</Label><Input value={testimonial.initials} onChange={(event) => updateSection("testimonials", content.testimonials.map((item, itemIndex) => itemIndex === index ? { ...item, initials: event.target.value } : item))} /></div>
                  <div className="space-y-2"><Label>Name</Label><Input value={testimonial.name} onChange={(event) => updateSection("testimonials", content.testimonials.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} /></div>
                  <div className="space-y-2"><Label>Company Line</Label><Input value={testimonial.company} onChange={(event) => updateSection("testimonials", content.testimonials.map((item, itemIndex) => itemIndex === index ? { ...item, company: event.target.value } : item))} /></div>
                </div>
                <div className="space-y-2"><Label>Quote</Label><Textarea rows={3} value={testimonial.quote} onChange={(event) => updateSection("testimonials", content.testimonials.map((item, itemIndex) => itemIndex === index ? { ...item, quote: event.target.value } : item))} /></div>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-12 lg:col-span-6 bg-[#0f172a]/40 backdrop-blur-[24px] border border-white/5 rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">quiz</span>
              <SectionTitle>FAQ Section</SectionTitle>
            </div>
            <button
              onClick={() => updateSection("faqs", [...content.faqs, { question: "", answer: "" }])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/10 text-[10px] font-headline font-bold uppercase tracking-[0.15em] text-primary transition hover:bg-primary/20"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add FAQ
            </button>
          </div>
          <div className="space-y-4 mb-6">
            <div className="space-y-2"><Label>Section Heading</Label><Input value={content.faqIntro.heading} onChange={(event) => updateSection("faqIntro", { ...content.faqIntro, heading: event.target.value })} /></div>
          </div>
          <div className="space-y-4">
            {content.faqs.map((faq, index) => (
              <div key={index} className="rounded-xl border border-white/10 bg-slate-950/60 p-5 space-y-3 relative group">
                <button
                  onClick={() => {
                    if (confirm(`Delete FAQ "${faq.question || index + 1}"?`)) {
                      updateSection("faqs", content.faqs.filter((_, i) => i !== index));
                    }
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100"
                  title="Delete FAQ"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
                <div className="space-y-2"><Label>Question</Label><Input value={faq.question} onChange={(event) => updateSection("faqs", content.faqs.map((item, itemIndex) => itemIndex === index ? { ...item, question: event.target.value } : item))} /></div>
                <div className="space-y-2"><Label>Answer</Label><Textarea rows={3} value={faq.answer} onChange={(event) => updateSection("faqs", content.faqs.map((item, itemIndex) => itemIndex === index ? { ...item, answer: event.target.value } : item))} /></div>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-12 lg:col-span-6 bg-[#0f172a]/40 backdrop-blur-[24px] border border-white/5 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary">campaign</span>
            <SectionTitle>CTA Section</SectionTitle>
          </div>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Headline</Label><Input value={content.cta.heading} onChange={(event) => updateSection("cta", { ...content.cta, heading: event.target.value })} /></div>
            <div className="space-y-2"><Label>Mobile Description</Label><Textarea rows={3} value={content.cta.mobileDescription} onChange={(event) => updateSection("cta", { ...content.cta, mobileDescription: event.target.value })} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Desktop Primary Label</Label><Input value={content.cta.primaryLabel} onChange={(event) => updateSection("cta", { ...content.cta, primaryLabel: event.target.value })} /></div>
              <div className="space-y-2"><Label>Desktop Primary Link</Label><Input value={content.cta.primaryHref} onChange={(event) => updateSection("cta", { ...content.cta, primaryHref: event.target.value })} /></div>
              <div className="space-y-2"><Label>Secondary Label</Label><Input value={content.cta.secondaryLabel} onChange={(event) => updateSection("cta", { ...content.cta, secondaryLabel: event.target.value })} /></div>
              <div className="space-y-2"><Label>Secondary Link</Label><Input value={content.cta.secondaryHref} onChange={(event) => updateSection("cta", { ...content.cta, secondaryHref: event.target.value })} /></div>
              <div className="space-y-2"><Label>Email</Label><Input value={content.cta.email} onChange={(event) => updateSection("cta", { ...content.cta, email: event.target.value })} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={content.cta.phone} onChange={(event) => updateSection("cta", { ...content.cta, phone: event.target.value })} /></div>
              <div className="space-y-2 md:col-span-2">
                <ImageField
                  label="WhatsApp Icon"
                  value={content.cta.whatsappIconUrl}
                  isUploading={uploadingField === "cta-whatsapp-icon"}
                  onChange={(value) => updateSection("cta", { ...content.cta, whatsappIconUrl: value })}
                  onUpload={async (file) => {
                    const url = await uploadImage("cta-whatsapp-icon", file);
                    updateSection("cta", { ...content.cta, whatsappIconUrl: url });
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
