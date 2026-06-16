"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Hydration-safe wrapper around framer-motion's useReducedMotion.
 * The server always renders the "motion" markup; the real OS preference
 * is only applied after mount so SSR and the first client render match.
 */
export function useReducedMotionSafe(): boolean {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? Boolean(reduceMotion) : false;
}

interface ScrollRevealProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
}

export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const reduceMotion = useReducedMotionSafe();
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, className = "", delay = 0 }: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideInLeft({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const reduceMotion = useReducedMotionSafe();
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideInRight({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const reduceMotion = useReducedMotionSafe();
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const reduceMotion = useReducedMotionSafe();
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* -- Stagger primitives ------------------------------------------- */

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.21, 0.65, 0.36, 1] } },
};

const staggerChildReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

interface StaggerGroupProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function StaggerGroup({ children, className = "" }: StaggerGroupProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: StaggerGroupProps) {
  const reduceMotion = useReducedMotionSafe();
  return (
    <motion.div variants={reduceMotion ? staggerChildReduced : staggerChild} className={className}>
      {children}
    </motion.div>
  );
}

/* -- Word-by-word headline reveal ---------------------------------- */

interface TextRevealProps {
  readonly text: string;
  readonly className?: string;
  readonly delay?: number;
}

export function TextReveal({ text, className = "", delay = 0 }: TextRevealProps) {
  const reduceMotion = useReducedMotionSafe();
  const words = text.split(" ").filter(Boolean);

  if (reduceMotion) {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay }}
        className={className}
      >
        {text}
      </motion.span>
    );
  }

  return (
    <span className={className} aria-label={text}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.7, delay: delay + index * 0.07, ease: [0.21, 0.65, 0.36, 1] }}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* -- Count-up stat value -------------------------------------------- */

interface CountUpProps {
  readonly value: string;
  readonly className?: string;
}

/**
 * Animates the leading number of a stat string ("50+", "100%", "24/7")
 * while preserving any prefix/suffix. Falls back to static text when the
 * value has no leading number or reduced motion is requested.
 */
export function CountUp({ value, className = "" }: CountUpProps) {
  const reduceMotion = useReducedMotionSafe();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? Number.parseFloat(match[2]) : null;
  const suffix = match?.[3] ?? "";
  const decimals = match?.[2]?.includes(".") ? match[2].split(".")[1].length : 0;

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 90, damping: 24 });

  useEffect(() => {
    if (inView && target !== null && !reduceMotion) {
      motionValue.set(target);
    }
  }, [inView, target, reduceMotion, motionValue]);

  useEffect(() => {
    if (target === null || reduceMotion) return;
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
      }
    });
  }, [springValue, prefix, suffix, decimals, target, reduceMotion]);

  if (target === null || reduceMotion) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {`${prefix}0${suffix}`}
    </span>
  );
}
