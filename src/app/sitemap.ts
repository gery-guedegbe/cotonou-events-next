import type { MetadataRoute } from "next";
import { getPublishedEvents } from "@/lib/supabase/events";

const BASE_URL = "https://cotonou.events";

const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/evenements", priority: 0.9, changeFrequency: "daily" },
  { path: "/alertes", priority: 0.7, changeFrequency: "weekly" },
  { path: "/soumettre", priority: 0.6, changeFrequency: "monthly" },
  { path: "/a-propos", priority: 0.4, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "monthly" },
  { path: "/signaler", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.1, changeFrequency: "yearly" },
  { path: "/conditions-utilisation", priority: 0.1, changeFrequency: "yearly" },
  { path: "/mentions-legales", priority: 0.1, changeFrequency: "yearly" },
  {
    path: "/politique-de-confidentialite",
    priority: 0.1,
    changeFrequency: "yearly",
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const events = await getPublishedEvents();
  const eventEntries = events.map((event) => ({
    url: `${BASE_URL}/evenements/${event.id}`,
    lastModified: event.date,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...eventEntries];
}
