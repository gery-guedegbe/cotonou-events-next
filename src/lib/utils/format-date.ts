const JOURS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];
const MOIS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];
const JOURS_ABBR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS_ABBR = [
  "JANV",
  "FÉVR",
  "MARS",
  "AVR",
  "MAI",
  "JUIN",
  "JUIL",
  "AOÛT",
  "SEPT",
  "OCT",
  "NOV",
  "DÉC",
];

/** "2025-05-17" -> "Samedi 17 mai 2025" */
export function formatFullDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "2025-05-17" -> { day: "17", month: "MAI" } pour le bloc date des cards mobile. */
export function formatDateBlock(iso: string): { day: string; month: string } {
  if (!iso) return { day: "", month: "" };
  const d = new Date(`${iso}T00:00:00`);
  return { day: String(d.getDate()), month: MOIS_ABBR[d.getMonth()] };
}

/** 0 -> "Gratuit" ; 5000 -> "5 000 FCFA" */
export function formatPrice(price: number): string {
  return price === 0 ? "Gratuit" : `${price.toLocaleString("fr-FR")} FCFA`;
}

/** Renvoie true le samedi/dimanche, pour le filtre "Ce week-end". */
export function isWeekend(iso: string): boolean {
  const day = new Date(`${iso}T00:00:00`).getDay();
  return day === 0 || day === 6;
}

/** ("2025-05-17", "20h00") -> "2025-05-17T20:00:00+01:00" (UTC+1, sans DST au Bénin). Pour le JSON-LD Event. */
export function toISODateTime(iso: string, time: string): string {
  const [h, m] = time.replace("h", ":").split(":");
  return `${iso}T${h.padStart(2, "0")}:${(m || "00").padStart(2, "0")}:00+01:00`;
}

const BENIN_TZ = "Africa/Porto-Novo";

/**
 * Décompose un timestamptz (toujours stocké en UTC par Postgres) en heure
 * murale du Bénin (UTC+1, sans DST), pour éviter un décalage d'affichage
 * selon le fuseau du serveur qui exécute le rendu.
 */
function getBeninParts(isoTimestamp: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BENIN_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(isoTimestamp));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour"), minute: get("minute") };
}

/** Timestamptz -> "2025-05-17" (date calendaire au Bénin), pour les filtres/regroupements. */
export function toBeninDateKey(isoTimestamp: string): string {
  const { year, month, day } = getBeninParts(isoTimestamp);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Timestamptz -> "Sam 17 mai" (heure du Bénin), pour les cards d'événement. */
export function formatShortDateLabel(isoTimestamp: string): string {
  const { year, month, day } = getBeninParts(isoTimestamp);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return `${JOURS_ABBR[weekday]} ${day} ${MOIS[month - 1]}`;
}

/** Timestamptz -> "20h00" (heure du Bénin). */
export function formatTimeLabel(isoTimestamp: string): string {
  const { hour, minute } = getBeninParts(isoTimestamp);
  return `${String(hour).padStart(2, "0")}h${String(minute).padStart(2, "0")}`;
}
