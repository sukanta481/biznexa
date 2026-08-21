import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import { COMPANY, SITE_URL } from "@/lib/constants";
import { OrganizationSchema } from "@/components/seo/JsonLd";

// 1. Exact Google Fonts mapped to Stitch's system
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const DEFAULT_TITLE = `${COMPANY.name} | Web Development & AI Automation Agency`;
const OG_IMAGE = {
  url: `${SITE_URL}/images/og-image.png`,
  width: 1200,
  height: 630,
  alt: COMPANY.name,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${COMPANY.name}`,
  },
  description: COMPANY.description,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: COMPANY.name,
    title: DEFAULT_TITLE,
    description: COMPANY.description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: COMPANY.description,
    images: [OG_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* Load Google Material Symbols for the exact Stitch Icons */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${spaceGrotesk.variable} ${manrope.variable} bg-background text-on-background font-body selection:bg-primary selection:text-on-primary-fixed antialiased min-h-screen flex flex-col overflow-x-hidden w-full`}
      >
        <OrganizationSchema />
        {children}
      </body>
    </html>
  );
}
