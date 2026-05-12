"use client";

import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  Layers3,
  ShoppingCart,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import * as PricingCard from "@/components/ui/pricing-card";

const plans = [
  {
    icon: <Briefcase />,
    name: "Starter",
    description: "Best for solo founders and local shops.",
    price: "₹24,999",
    period: "(one-time)",
    variant: "outline" as const,
    href: "/contact?plan=starter",
    features: [
      { label: "Up to 5 Pages", included: true },
      { label: "Template-Based Design", included: true },
      { label: "Basic CMS", included: true },
      { label: "On-Page SEO Basics", included: true },
      { label: "80+ Speed Score", included: true },
      { label: "Mobile Optimized", included: true },
      { label: "WhatsApp / Form Integration", included: true },
      { label: "AI Chatbot", included: false },
      { label: "AI Lead Capture", included: false },
      { label: "Google Analytics Dashboard", included: true },
      { label: "2 Revisions", included: true },
      { label: "Delivery in 10-14 Days", included: true },
      { label: "30 Days Support", included: true },
    ],
  },
  {
    icon: <ShoppingCart />,
    name: "Growth",
    description: "Best for SMBs and D2C brands.",
    badge: "Most Popular",
    price: "₹59,999",
    period: "(one-time)",
    variant: "default" as const,
    href: "/contact?plan=growth",
    features: [
      { label: "Up to 12 Pages", included: true },
      { label: "Custom UI/UX Design", included: true },
      { label: "WordPress / Headless CMS", included: true },
      { label: "Full Tech SEO + Schema", included: true },
      { label: "90+ Speed Score", included: true },
      { label: "Mobile Optimized", included: true },
      { label: "WhatsApp / Form Integration", included: true },
      { label: "Basic FAQ AI Bot", included: true },
      { label: "AI Lead Capture", included: true },
      { label: "GA4 + Hotjar Dashboard", included: true },
      { label: "Advanced AI Agent", included: false },
      { label: "5 Revisions", included: true },
      { label: "Delivery in 3-4 Weeks", included: true },
      { label: "90 Days Support", included: true },
    ],
  },
  {
    icon: <Layers3 />,
    name: "Scale",
    description: "Best for e-commerce and funded startups.",
    price: "₹1,49,999+",
    period: "(one-time)",
    variant: "outline" as const,
    href: "/contact?plan=scale",
    features: [
      { label: "Unlimited Pages", included: true },
      { label: "Premium Custom Design + Animation", included: true },
      { label: "Headless CMS + Custom Dashboard", included: true },
      { label: "SEO + Core Web Vitals", included: true },
      { label: "95+ Speed Score", included: true },
      { label: "Mobile Optimized", included: true },
      { label: "WhatsApp / Form Integration", included: true },
      { label: "Advanced AI Agent", included: true },
      { label: "AI Lead Capture", included: true },
      { label: "Custom Analytics Dashboard", included: true },
      { label: "Unlimited Revisions", included: true },
      { label: "Delivery in 6-10 Weeks", included: true },
      { label: "6 Months Support", included: true },
    ],
  },
];

export default function PricingPlansSection() {
  return (
    <section className="py-20 md:py-24 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-16 text-center">
          <span className="font-label text-[10px] md:text-xs uppercase tracking-[0.28em] text-primary/80">
            Website Pricing
          </span>
          <h2 className="mt-4 font-headline text-3xl md:text-6xl font-bold text-white leading-tight">
            Pick The Right
            <span className="block text-primary text-glow">Growth Plan</span>
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-sm md:text-base text-on-surface-variant leading-relaxed">
            Transparent one-time INR pricing for founders, growing brands, and scale-stage businesses.
            Every plan is mapped to CMS depth, SEO performance, AI capability, delivery speed, and post-launch support.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(8,14,24,0.96),rgba(4,8,14,0.96))] px-4 py-8 md:px-8 md:py-10 shadow-[0_0_60px_rgba(0,255,102,0.08)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(rgba(0,229,255,0.12) 0.8px, transparent 0.8px)",
              backgroundSize: "16px 16px",
              maskImage:
                "radial-gradient(circle at 50% 0%, rgba(0,0,0,1), rgba(0,0,0,0.45) 55%, rgba(0,0,0,0) 100%)",
            }}
          />
          <div className="relative grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard.Card
                key={plan.name}
                className={cn(
                  "group mx-auto max-w-none border-white/10 bg-[rgba(8,14,24,0.92)] shadow-[0_20px_80px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_28px_90px_rgba(0,255,102,0.16)]",
                  plan.badge && "ring-1 ring-primary/40",
                )}
              >
                <PricingCard.Header className="mb-0 border-white/10 bg-[rgba(19,31,56,0.8)] transition-colors duration-300 group-hover:bg-[rgba(22,36,64,0.92)]">
                  <PricingCard.Plan className="mb-6 items-start gap-3">
                    <div>
                      <PricingCard.PlanName className="text-primary">
                        {plan.icon}
                        <span className="font-label uppercase tracking-[0.18em] text-primary transition-all duration-300 group-hover:text-[#6aff9c] group-hover:text-glow">
                          {plan.name}
                        </span>
                      </PricingCard.PlanName>
                      <PricingCard.Description className="mt-2 max-w-[18rem] text-on-surface-variant">
                        {plan.description}
                      </PricingCard.Description>
                    </div>
                    {plan.badge && (
                      <PricingCard.Badge className="border-primary/30 bg-primary/12 text-primary">
                        {plan.badge}
                      </PricingCard.Badge>
                    )}
                  </PricingCard.Plan>

                  <PricingCard.Price className="items-end">
                    <PricingCard.MainPrice className="text-white transition-all duration-300 group-hover:text-primary group-hover:text-glow">
                      {plan.price}
                    </PricingCard.MainPrice>
                    <PricingCard.Period className="text-on-surface-variant">
                      {plan.period}
                    </PricingCard.Period>
                  </PricingCard.Price>

                  <Button
                    asChild
                    variant={plan.variant}
                    className={cn(
                      "mt-4 w-full rounded-xl font-headline font-bold uppercase tracking-[0.2em]",
                      plan.variant === "default"
                        ? "border border-primary bg-primary text-on-primary shadow-[0_0_24px_rgba(0,255,102,0.28)] hover:bg-primary/90"
                        : "border-primary/40 bg-transparent text-primary hover:bg-primary/10 hover:text-primary",
                    )}
                  >
                    <Link href={plan.href}>Select Plan</Link>
                  </Button>
                </PricingCard.Header>

                <PricingCard.Body className="pt-6">
                  <PricingCard.Separator className="text-on-surface-variant/80">
                    Includes
                  </PricingCard.Separator>
                  <PricingCard.List>
                    {plan.features.map((item) => (
                      <PricingCard.ListItem
                        key={item.label}
                        className={cn(
                          "transition-colors duration-300",
                          item.included ? "text-on-surface-variant" : "text-red-300/85",
                        )}
                      >
                        {item.included ? (
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:scale-110"
                            aria-hidden="true"
                          />
                        ) : (
                          <XCircle
                            className="mt-0.5 h-4 w-4 shrink-0 text-red-400 transition-transform duration-300 group-hover:scale-110"
                            aria-hidden="true"
                          />
                        )}
                        <span>{item.label}</span>
                      </PricingCard.ListItem>
                    ))}
                  </PricingCard.List>
                </PricingCard.Body>
              </PricingCard.Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
