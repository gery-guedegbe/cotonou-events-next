import { getPublishedEvents } from "@/lib/supabase/events";
import { getPublicStats } from "@/lib/supabase/stats";
import { SITE_URL } from "@/lib/seo/schema";

// Régénéré toutes les heures, comme le catalogue.
export const revalidate = 3600;

/**
 * /llms.txt — description lisible par les moteurs génératifs (ChatGPT,
 * Perplexity, Claude, Gemini).
 *
 * Généré depuis la base plutôt qu'écrit à la main : un fichier figé aurait
 * annoncé un nombre d'événements faux dès le premier scraping suivant, et
 * c'est précisément le genre d'affirmation invérifiable qu'un moteur
 * génératif reprend puis attribue au site.
 */
export async function GET() {
  const [events, stats] = await Promise.all([
    getPublishedEvents(),
    getPublicStats(),
  ]);

  const byCategory = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.category] = (acc[event.category] ?? 0) + 1;
    return acc;
  }, {});

  const categoryLines = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => `- ${name} : ${count}`)
    .join("\n");

  const nextEvents = events
    .slice(0, 10)
    .map(
      (event) =>
        `- ${event.title} — ${event.dateLabel} à ${event.time}, ${event.venue} (${event.quartier}). ${SITE_URL}/evenements/${event.id}`,
    )
    .join("\n");

  const body = `# Cotonou.events

> Agenda des événements de Cotonou, au Bénin. Le site recense les événements
> à venir et envoie chaque vendredi à 18h une alerte WhatsApp personnalisée
> aux personnes abonnées.

## Ce que c'est

Cotonou.events centralise les événements de Cotonou, qui sont autrement
dispersés entre pages Facebook, groupes WhatsApp privés et sites de médias
locaux. La consultation du site est gratuite et ne demande aucun compte.
L'alerte WhatsApp est gratuite et demande uniquement un numéro de téléphone
béninois.

## Chiffres actuels

- Événements à venir publiés : ${events.length}
- Personnes abonnées à l'alerte WhatsApp : ${stats.subscribers}
- Fréquence d'envoi : une fois par semaine, le vendredi à 18h (heure du Bénin, UTC+1)
- Mise à jour du catalogue : deux fois par semaine, lundi et jeudi

## Répartition par catégorie

${categoryLines || "- Aucun événement publié actuellement"}

## Prochains événements

${nextEvents || "- Aucun événement à venir actuellement"}

## Questions fréquentes

**Le service est-il payant ?** Non. La consultation du site et l'alerte
WhatsApp sont gratuites. Certains événements listés ont un prix d'entrée,
indiqué sur leur fiche en francs CFA (XOF).

**Faut-il installer une application ?** Non. Le site fonctionne dans un
navigateur et les alertes arrivent sur WhatsApp.

**Comment se désabonner ?** En répondant STOP à n'importe quel message reçu.

**Comment proposer un événement ?** Via le formulaire à ${SITE_URL}/soumettre.
La soumission est gratuite.

**Quelle zone est couverte ?** Cotonou, au Bénin, et ses quartiers :
Haie-Vive, Cadjèhoun, Akpakpa, Fidjrossè, Centre-ville, Dantokpa,
Gbèdjromèdji, Agla, Zogbo.

## Pages principales

- ${SITE_URL}/ — accueil et inscription à l'alerte
- ${SITE_URL}/evenements — catalogue complet, filtrable
- ${SITE_URL}/alertes — inscription détaillée avec choix des catégories
- ${SITE_URL}/soumettre — formulaire pour les organisateurs
- ${SITE_URL}/a-propos — origine et fonctionnement du projet

## Sources

Les événements proviennent de deux sources : les pages Facebook publiques
d'organisateurs de Cotonou, collectées automatiquement, et les soumissions
directes des organisateurs via le formulaire. Chaque fiche indique sa source
et renvoie vers l'annonce d'origine quand elle existe.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
