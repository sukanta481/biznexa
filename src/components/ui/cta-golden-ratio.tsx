import Link from "next/link";

import { cn } from "@/lib/utils";

export interface CtaGoldenRatioContent {
  heading: string;
  mobileDescription: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  email: string;
  phone: string;
  whatsappIconUrl: string;
}

/**
 * Decorative golden-spiral geometry. Purely visual, so it is hidden from
 * assistive technology and never intercepts pointer events.
 *
 * Two variants, because the spiral is drawn against a fixed viewBox: the
 * portrait one reads correctly in a tall column, the landscape one in a wide
 * block.
 */
function SpiralPortrait() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 210 340"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="text-white/[0.07]">
        <path d="M380.853 105.099L-201.625 464.632" stroke="currentColor" strokeDasharray="4 2" vectorEffect="non-scaling-stroke" />
        <path d="M-165.247 -267.831L369.777 600.141" stroke="currentColor" strokeDasharray="4 2" vectorEffect="non-scaling-stroke" />
        <path d="M209.5 260L130 260" stroke="currentColor" vectorEffect="non-scaling-stroke" />
        <path d="M129.5 339.5L129.5 210" stroke="currentColor" vectorEffect="non-scaling-stroke" />
        <path d="M159.5 260L159.5 210" stroke="currentColor" vectorEffect="non-scaling-stroke" />
        <path d="M0 210L209.5 210" stroke="currentColor" vectorEffect="non-scaling-stroke" />
        <path d="M160 240L130.133 240" stroke="currentColor" vectorEffect="non-scaling-stroke" />
        <path d="M149.5 240L149.5 260" stroke="currentColor" vectorEffect="non-scaling-stroke" />
        <rect x="159.5" y="210" width="30" height="30" transform="rotate(90 159.5 210)" stroke="currentColor" vectorEffect="non-scaling-stroke" />
        <rect x="149.5" y="240" width="20" height="20" transform="rotate(90 149.5 240)" stroke="currentColor" vectorEffect="non-scaling-stroke" />
        <rect x="159.5" y="240" width="20" height="10" transform="rotate(90 159.5 240)" stroke="currentColor" vectorEffect="non-scaling-stroke" />
      </g>
      <path
        className="text-primary/25"
        d="M149.643 239.897C155.106 239.897 159.619 244.414 159.619 249.882C159.619 255.35 155.106 259.868 149.643 259.868C138.717 259.868 129.69 250.833 129.69 239.897C129.69 223.493 143.23 209.941 159.619 209.941C186.935 209.941 209.5 232.527 209.5 259.868C209.5 303.613 173.396 339.75 129.69 339.75C58.6695 339.75 -1.22732e-05 281.027 -9.16589e-06 209.941C-4.14648e-06 95.1103 94.7738 0.24998 209.5 0.249985C395.69 0.250001 549.5 154.06 549.5 340.25"
        stroke="currentColor"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function SpiralLandscape() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 340 210"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="text-white/[0.07]">
        <path d="M105.1 -170.853L464.633 411.625" stroke="currentColor" strokeDasharray="4 2" vectorEffect="non-scaling-stroke" />
        <path d="M-267.831 375.247L600.141 -159.777" stroke="currentColor" strokeDasharray="4 2" vectorEffect="non-scaling-stroke" />
        <path d="M260 0.5V80" stroke="currentColor" vectorEffect="non-scaling-stroke" />
        <path d="M339.5 80.5H210" stroke="currentColor" vectorEffect="non-scaling-stroke" />
        <path d="M210 210V0.5" stroke="currentColor" vectorEffect="non-scaling-stroke" />
        <rect x="210" y="50.5" width="30" height="30" stroke="currentColor" vectorEffect="non-scaling-stroke" />
        <rect x="240" y="60.5" width="20" height="20" stroke="currentColor" vectorEffect="non-scaling-stroke" />
        <rect x="240" y="50.5" width="20" height="10" stroke="currentColor" vectorEffect="non-scaling-stroke" />
      </g>
      <path
        className="text-primary/25"
        d="M239.897 60.3571C239.897 54.894 244.414 50.381 249.882 50.381C255.35 50.381 259.868 54.894 259.868 60.3571C259.868 71.2835 250.833 80.3095 239.897 80.3095C223.493 80.3095 209.941 66.7704 209.941 50.381C209.941 23.0652 232.527 0.499999 259.868 0.5C303.613 0.499995 339.75 36.6043 339.75 80.3095C339.75 151.33 281.027 210 209.941 210C95.1103 210 0.25 115.226 0.25 0.5C0.250008 -185.69 154.06 -339.5 340.25 -339.5"
        stroke="currentColor"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-6 w-6 md:h-7 md:w-7 shrink-0 text-[#25D366] drop-shadow-[0_0_10px_rgba(37,211,102,0.4)]", className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.012 0C5.38 0 0 5.378 0 12.01c0 2.12.553 4.194 1.603 6.012L0 24l6.17-1.618A11.96 11.96 0 0 0 12.012 24C18.642 24 24 18.62 24 11.988 24 5.356 18.64 0 12.012 0zm.006 22.003h-.008a9.98 9.98 0 0 1-5.093-1.397l-.365-.218-3.674.963.98-3.582-.238-.378a9.94 9.94 0 0 1-1.527-5.38C2.093 6.536 6.542 2.087 12.018 2.087c2.65 0 5.14 1.033 7.013 2.908a9.89 9.89 0 0 1 2.9 7.009c0 5.48-4.448 9.999-9.913 9.999zm5.438-7.48c-.298-.15-1.763-.87-2.036-.97-.272-.1-.47-.15-.668.15-.198.298-.768.97-.94 1.168-.174.198-.348.223-.646.075-.298-.15-1.26-.464-2.4-1.48-.888-.79-1.488-1.767-1.662-2.065-.174-.298-.018-.46.13-.608.134-.134.298-.348.447-.52.15-.174.198-.298.298-.496.1-.198.05-.372-.025-.52-.074-.15-.668-1.611-.916-2.207-.242-.579-.487-.5-.668-.51h-.57-.001c-.198 0-.52.075-.793.372s-1.04 1.016-1.04 2.479c0 1.463 1.065 2.875 1.213 3.073.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.711.226 1.358.194 1.87.117.571-.085 1.763-.719 2.011-1.413.248-.694.248-1.289.174-1.413-.075-.124-.273-.198-.571-.348z" />
    </svg>
  );
}

function ContactRow({ cta, className }: { cta: CtaGoldenRatioContent; className?: string }) {
  const isPlaceholderIcon =
    !cta.whatsappIconUrl ||
    cta.whatsappIconUrl.includes("googleusercontent.com") ||
    cta.whatsappIconUrl === "/whatsapp.svg";

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6", className)}>
      <a
        href={`mailto:${cta.email}`}
        className="font-headline text-lg font-light text-primary underline decoration-primary/40 underline-offset-8 transition-colors hover:text-tertiary md:text-2xl"
      >
        {cta.email}
      </a>
      <span className="hidden text-outline-variant sm:block">/</span>
      <a
        href={`https://wa.me/${cta.phone.replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 font-headline text-base font-medium text-white transition-colors hover:text-primary md:text-xl group"
      >
        {isPlaceholderIcon ? (
          <WhatsAppIcon />
        ) : (
          <img alt="WhatsApp" className="h-6 w-6 md:h-7 md:w-7 object-contain" src={cta.whatsappIconUrl} />
        )}
        {cta.phone}
      </a>
    </div>
  );
}

function Actions({ cta, className }: { cta: CtaGoldenRatioContent; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row", className)}>
      <Link
        href={cta.primaryHref}
        className="rounded-full bg-primary px-10 py-4 text-center font-headline text-sm font-extrabold uppercase tracking-widest text-on-primary-fixed shadow-[0_0_24px_rgba(0,255,102,0.3)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,255,102,0.5)] active:scale-95"
      >
        {cta.primaryLabel}
      </Link>
      <Link
        href={cta.secondaryHref}
        className="rounded-full border border-white/15 px-10 py-4 text-center font-headline text-sm font-bold uppercase tracking-widest text-on-surface transition-all duration-300 hover:border-primary/40 hover:text-white active:scale-95"
      >
        {cta.secondaryLabel}
      </Link>
    </div>
  );
}

function MainContent({ cta, className }: { cta: CtaGoldenRatioContent; className?: string }) {
  return (
    <div className={cn("flex flex-col justify-center overflow-hidden p-6 sm:p-8 lg:p-12", className)}>
      <h2 className="mb-5 font-headline text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl xl:tracking-tighter">
        {cta.heading}
      </h2>

      <p className="mb-8 max-w-xl font-body text-sm leading-relaxed text-on-surface-variant sm:text-base lg:text-lg">
        {cta.mobileDescription}
      </p>

      <ContactRow cta={cta} className="mb-8" />
      <Actions cta={cta} />
    </div>
  );
}

/**
 * Call to action laid out on a golden-ratio grid, with the spiral that
 * generates those proportions drawn behind it. Desktop keeps the 1.618
 * proportions; small screens stack instead, because a locked aspect ratio
 * leaves too little room for the heading, contacts and both actions on a
 * phone.
 */
export function CtaGoldenRatio({ cta }: { cta: CtaGoldenRatioContent }) {
  return (
    <section className="px-4 pb-20 sm:px-6 md:px-8 md:pb-28">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface-container-low/60 lg:hidden">
          <SpiralPortrait />
          <MainContent cta={cta} className="relative z-10" />
        </div>

        <div className="relative hidden overflow-hidden rounded-[2.5rem] border border-white/10 bg-surface-container-low/60 lg:block">
          <SpiralLandscape />
          <div className="relative grid aspect-[1.618/1] grid-cols-[1.618fr_minmax(0,1fr)] grid-rows-[1fr_1.618fr]">
            <MainContent cta={cta} className="z-10 col-start-1 row-span-2 row-start-1" />
            <div className="col-start-2 row-start-1" />
            <div className="col-start-2 row-start-2" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaGoldenRatio;
