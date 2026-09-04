import type { Metadata, Viewport } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { HashScroll } from "@/components/layout/hash-scroll";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MotionActivator } from "@/components/motion/motion-activator";
import { ThemeScript } from "@/components/theme/theme-script";
import { DEFAULT_THEME, THEME_COLORS } from "@/components/theme/theme";
import { portfolio } from "@/data/portfolio";

import "./globals.css";
import "./motion-effects.css";

// Width is a working axis in this design system, not decoration: the document
// title block is set expanded, running text sits at normal width, and the
// tabular label rail is condensed. One self-hosted family covers all three.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-sans",
  display: "swap",
});

const martianMono = Martian_Mono({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-mono",
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
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${portfolio.identity.displayName} — Software, AI systems, and data infrastructure` }],
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
      className={`${archivo.variable} ${martianMono.variable}`}
      data-scroll-behavior="smooth"
      data-theme={DEFAULT_THEME}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
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
