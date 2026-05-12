"use client";

import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  Rocket,
  ShoppingCart,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import * as PricingCard from "@/components/ui/pricing-card";

const plans = [
  {
    icon: <Rocket />,
    name: "Startup Plan",
    description: "Ideal for founders and local businesses launching a clean digital presence.",
    price: "₹5,499",
    period: "/project",
    variant: "outline" as const,
    href: "/contact?plan=startup",
    features: [
      "1 Year Domain Free",
      "1 Year Hosting Free",
      "SSL Certificate Free",
      "5 Pages Website",
      "Mobile Responsive Design",
      "WhatsApp Button Integration",
    ],
  },
  {
    icon: <Briefcase />,
    name: "Business Plan",
    description: "Best for growing brands that need stronger visibility and lead capture.",
    badge: "Most Popular",
    price: "₹9,999",
    period: "/project",
    variant: "default" as const,
    href: "/contact?plan=business",
    features: [
      "1 Year Domain Included",
      "1 Year Hosting Included",
      "10 Pages Website",
      "SEO Setup",
      "Business Email",
      "WhatsApp + Call Button",
      "Social Media Integration",
    ],
  },
  {
    icon: <ShoppingCart />,
    name: "E-Commerce Plan",
    description: "For stores that want product listings, payments, and admin control from day one.",
    price: "₹14,999",
    period: "/project",
    variant: "outline" as const,
    href: "/contact?plan=ecommerce",
    features: [
      "1 Year Domain Free",
      "1 Year Hosting Free",
      "Online Store Setup",
      "20 Products Upload",
      "Payment Gateway Integration",
      "Admin Panel Access",
      "WhatsApp Integration",
      "Fully Responsive Design",
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
            <span className="block text-primary text-glow">Website Plan</span>
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-sm md:text-base text-on-surface-variant leading-relaxed">
            Transparent INR pricing for startups, business websites, and e-commerce stores.
            Every package is crafted for fast launch, responsive performance, and conversion-ready structure.
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
                  "mx-auto max-w-none border-white/10 bg-[rgba(8,14,24,0.92)] shadow-[0_20px_80px_rgba(0,0,0,0.28)]",
                  plan.badge && "ring-1 ring-primary/40",
                )}
              >
                <PricingCard.Header className="mb-0 border-white/10 bg-[rgba(19,31,56,0.8)]">
                  <PricingCard.Plan className="mb-6 items-start gap-3">
                    <div>
                      <PricingCard.PlanName className="text-primary">
                        {plan.icon}
                        <span className="font-label uppercase tracking-[0.18em] text-primary">
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
                    <PricingCard.MainPrice className="text-white">
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
                      <PricingCard.ListItem key={item} className="text-on-surface-variant">
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
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
