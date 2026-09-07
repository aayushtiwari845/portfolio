import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import { HashScroll } from "@/components/layout/hash-scroll";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MotionActivator } from "@/components/motion/motion-activator";
import { ModeScript } from "@/components/orrery/mode-script";
import { DEFAULT_VIEW } from "@/components/orrery/mode";
import { ThemeScript } from "@/components/theme/theme-script";
import { DEFAULT_THEME, THEME_COLORS } from "@/components/theme/theme";
import { portfolio } from "@/data/portfolio";

import "./globals.css";
import "./motion-effects.css";
import "./orrery.css";

// Three faces, each with one job, chosen for a dark spatial interface rather
// than for a paper document.
//
// Space Grotesk sets every heading: a technical grotesk with enough character
// to carry a title block, and enough restraint not to fight the scene behind
// it. Inter Tight runs the body, because the case studies are long and dense
// and nothing reads better at fifteen paragraphs. JetBrains Mono is reserved
// for figures and telemetry, never for prose.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-body-face",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(portfolio.metadata.siteUrl),
  title: {
    default: portfolio.metadata.title,
    template: portfolio.metadata.titleTemplate,
  },
  description: portfolio.metadata.description,
  alternates: { canonical: "/" },
  authors: [{ name: portfolio.identity.fullName, url: portfolio.metadata.siteUrl }],
  creator: portfolio.identity.fullName,
  openGraph: {
    type: "website",
    locale: portfolio.metadata.locale,
    url: "/",
    siteName: portfolio.identity.displayName,
    title: portfolio.metadata.title,
    description: portfolio.metadata.description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${portfolio.identity.displayName}: software, AI systems, and data infrastructure` }],
  },
  twitter: {
    card: "summary_large_image",
    title: portfolio.metadata.title,
    description: portfolio.metadata.description,
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: THEME_COLORS.light,
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      className={`${spaceGrotesk.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
      data-scroll-behavior="smooth"
      data-theme={DEFAULT_THEME}
      data-view={DEFAULT_VIEW}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <ModeScript />
      </head>
      <body>
        <MotionActivator />
        <HashScroll />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader
          displayName={portfolio.identity.displayName}
          githubHref={portfolio.links.github}
          linkedinHref={portfolio.links.linkedin}
          navigation={portfolio.navigation}
        />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
