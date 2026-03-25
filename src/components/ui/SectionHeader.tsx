import type { ReactNode } from "react";

interface SectionHeaderProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly align?: "left" | "center";
  readonly children?: ReactNode;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  children,
}: SectionHeaderProps) {
  return (
    <div className={`mb-16 ${align === "center" ? "text-center" : "text-left"}`}>
      {eyebrow && (
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wider text-text-primary mb-4">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-text-secondary text-lg leading-relaxed ${
            align === "center" ? "max-w-2xl mx-auto" : "max-w-3xl"
          }`}
        >
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
