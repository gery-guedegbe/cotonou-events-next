import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/soumettre/confirmation"],
    },
    sitemap: "https://cotonouevents.tech/sitemap.xml",
  };
}
