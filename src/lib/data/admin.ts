/**
 * Logs d'illustration pour l'onglet Système. Cet onglet visualise les
 * automatisations n8n/Apify/WhatsApp, qui n'existent pas encore (voir
 * CLAUDE.md, étapes 2 à 5 de la feuille de route) — contenu statique en
 * attendant ces intégrations.
 */
export const SYSTEM_LOGS = [
  "[06:00:01] apify.run started — actor cotonou-events-scraper",
  "[06:00:14] fetched 38 listings from facebook events",
  "[06:00:22] dedupe: 4 duplicates skipped",
  "[06:00:23] inserted 12 new events (status=pending)",
  "[06:00:24] apify.run finished ✓ (23.4s)",
  "[12:00:00] cron: digest-preview generated for 127 subscribers",
  "[12:00:01] segmentation: 7 categories matched",
  "[18:00:00] whatsapp.send queued — 127 messages",
  "[18:02:11] whatsapp.send delivered 124 / failed 3",
  "[18:02:12] retry scheduled for 3 failed deliveries",
];
