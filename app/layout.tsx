import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { MotionProvider } from "@/components/layout/motion-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { portfolio } from "@/data/portfolio";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
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
  themeColor: "#070809",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <MotionProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
