import type { MetadataRoute } from "next";

import { portfolio } from "@/data/portfolio";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = portfolio.metadata.siteUrl.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
