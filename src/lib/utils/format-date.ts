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

/**
 * Libellé de prix qui distingue la participation libre du tarif fixe.
 * Sans cette distinction, un événement à donation s'affiche comme payant au
 * tarif exact, ce qui est faux.
 */
export function formatEventPrice(
  priceType: "gratuit" | "payant" | "donation",
  amount: number | null,
): string {
  if (priceType === "gratuit") return "Gratuit";
  const montant = amount ? `${amount.toLocaleString("fr-FR")} FCFA` : null;
  if (priceType === "donation") {
    return montant ? `Libre, dès ${montant}` : "Participation libre";
  }
  return montant ?? "Payant";
}

/**
 * Fenêtre du week-end à venir, en clés de date Bénin.
 *
 * "Ce week-end" doit désigner le week-end qui arrive, pas n'importe quel
 * samedi. Pendant le week-end lui-même, la fenêtre reste celle en cours pour
 * qu'un événement du samedi ne disparaisse pas le samedi matin.
 */
export function getUpcomingWeekend(): { start: string; end: string } {
  const today = beninToday();
  const day = today.getUTCDay(); // 0 = dimanche, 6 = samedi

  let fridayOffset: number;
  if (day === 6) fridayOffset = -1; // samedi : le week-end a commencé hier
  else if (day === 0) fridayOffset = -2; // dimanche : vendredi il y a 2 jours
  else fridayOffset = 5 - day; // lundi..jeudi : prochain vendredi

  return {
    start: shiftDateKey(today, fridayOffset),
    end: shiftDateKey(today, fridayOffset + 2),
  };
}

/** Renvoie true si la date tombe dans le week-end à venir (vendredi à dimanche). */
export function isUpcomingWeekend(iso: string): boolean {
  const { start, end } = getUpcomingWeekend();
  return iso >= start && iso <= end;
}

/** Renvoie true si la date tombe entre aujourd'hui et la fin de la semaine courante (dimanche). */
export function isInCurrentWeek(iso: string): boolean {
  const today = beninToday();
  const day = today.getUTCDay();
  const daysToSunday = day === 0 ? 0 : 7 - day;
  return iso >= beninTodayKey() && iso <= shiftDateKey(today, daysToSunday);
}

/** Renvoie true si la date tombe entre aujourd'hui et la fin du mois courant. */
export function isInCurrentMonth(iso: string): boolean {
  const today = beninToday();
  const endOfMonth = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0),
  );
  return iso >= beninTodayKey() && iso <= toDateKey(endOfMonth);
}

/** Renvoie true si la date est aujourd'hui ou plus tard (heure du Bénin). */
export function isUpcoming(iso: string): boolean {
  return iso >= beninTodayKey();
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
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
  };
}

/** Timestamptz -> "2025-05-17" (date calendaire au Bénin), pour les filtres/regroupements. */
export function toBeninDateKey(isoTimestamp: string): string {
  const { year, month, day } = getBeninParts(isoTimestamp);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Date -> "2025-05-17" à partir des composantes UTC. */
function toDateKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

/**
 * Aujourd'hui au Bénin, normalisé à minuit UTC.
 *
 * On passe par les composantes calendaires béninoises plutôt que par l'heure
 * locale du serveur : un rendu Vercel dans une autre région basculerait sinon
 * d'un jour, et décalerait tous les filtres de date.
 */
function beninToday(): Date {
  const { year, month, day } = getBeninParts(new Date().toISOString());
  return new Date(Date.UTC(year, month - 1, day));
}

/** Décale une date de n jours et renvoie la clé "YYYY-MM-DD". */
function shiftDateKey(base: Date, days: number): string {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + days);
  return toDateKey(d);
}

/** Clé de date d'aujourd'hui au Bénin ("2025-05-17"). */
export function beninTodayKey(): string {
  return toDateKey(beninToday());
}

/**
 * Début de la journée béninoise courante, en ISO UTC.
 * Sert de plancher aux requêtes Supabase pour exclure les événements passés,
 * tout en gardant visibles ceux qui ont lieu plus tard dans la journée.
 */
export function beninStartOfTodayISO(): string {
  return `${beninTodayKey()}T00:00:00+01:00`;
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

/** Timestamptz -> "2 mai 2025" (heure du Bénin, sans jour de semaine), pour les listes admin. */
export function formatAdminDate(isoTimestamp: string): string {
  const { year, month, day } = getBeninParts(isoTimestamp);
  return `${day} ${MOIS[month - 1]} ${year}`;
}

/** Timestamptz -> "à l'instant" / "il y a 3h" / "il y a 2j", pour les listes admin. */
export function formatRelativeTime(isoTimestamp: string): string {
  const minutes = Math.floor(
    (Date.now() - new Date(isoTimestamp).getTime()) / 60000,
  );
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  return `il y a ${Math.floor(hours / 24)}j`;
}
