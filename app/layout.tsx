import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MotionActivator } from "@/components/motion/motion-activator";
import { ThemeScript } from "@/components/theme/theme-script";
import { DEFAULT_THEME, THEME_COLORS } from "@/components/theme/theme";
import { portfolio } from "@/data/portfolio";

import "./globals.css";
import "./motion-effects.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "optional",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "optional",
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
  themeColor: THEME_COLORS.dark,
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      className={`${geist.variable} ${geistMono.variable}`}
      data-theme={DEFAULT_THEME}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <MotionActivator />
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
