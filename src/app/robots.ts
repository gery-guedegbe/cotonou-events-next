import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/secure-portal-5d24", "/soumettre/confirmation"],
    },
    sitemap: "https://cotonouevents.tech/sitemap.xml",
  };
}
