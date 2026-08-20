import type { Metadata } from "next";

import { COMPANY, SITE_URL } from "@/lib/constants";

const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/images/og-image.png`,
  width: 1200,
  height: 630,
  alt: `${COMPANY.name} — ${COMPANY.tagline}`,
};

interface PageMetaInput {
  /** 50-60 chars. Must be unique across the site. */
  title: string;
  /** 120-160 chars. Must be unique across the site. Should carry a CTA. */
  description: string;
  /** Site-root-relative, e.g. "/services". Use "/" for the homepage. */
  path: string;
  /** Absolute URL, or a site-root-relative path. Falls back to the OG card. */
  image?: string;
}

/**
 * Single source of truth for page metadata.
 *
 * Every public page builds its metadata through this so canonicals can never
 * drift from the canonical host again — the site previously shipped with no
 * canonical tag on any page, and four pages sharing one title and description.
 */
export function pageMeta({ title, description, path, image }: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const og = image
    ? {
        url: image.startsWith("http") ? image : `${SITE_URL}${image}`,
        width: 1200,
        height: 630,
        alt: title,
      }
    : DEFAULT_OG_IMAGE;

  return {
    // `absolute` opts out of the root layout's `%s | BizNexa` template. Titles
    // here already carry the brand, and letting the template append a second
    // one is what produced "... | Biznexa | BizNexa" on /blog.
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: COMPANY.name,
      title,
      description,
      url,
      images: [og],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og.url],
    },
  };
}
