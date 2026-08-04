import type { MetadataRoute } from "next";
import { getPublishedEvents } from "@/lib/supabase/events";

const BASE_URL = "https://cotonou.events";

/** Pages dont le contenu dépend du catalogue d'événements. */
const DYNAMIC_PATHS = new Set(["/", "/evenements"]);

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
  const events = await getPublishedEvents();
  const now = new Date();

  // Les pages de liste changent dès qu'un événement entre en base : leur
  // fraîcheur suit donc la dernière insertion, pas la date du jour.
  const lastInsert = events.reduce<Date>((latest, event) => {
    if (!event.createdAt) return latest;
    const created = new Date(event.createdAt);
    return created > latest ? created : latest;
  }, new Date(0));
  const catalogueUpdatedAt = lastInsert.getTime() ? lastInsert : now;

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: DYNAMIC_PATHS.has(route.path) ? catalogueUpdatedAt : now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const eventEntries = events.map((event) => ({
    url: `${BASE_URL}/evenements/${event.id}`,
    // Date d'insertion, pas date de l'événement. `event.date` est par
    // construction dans le futur : un lastModified postérieur à aujourd'hui
    // est invalide et jette le doute sur tout le sitemap.
    lastModified: event.createdAt ? new Date(event.createdAt) : now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...eventEntries];
}
