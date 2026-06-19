/** Ne conserve que les chiffres d'une saisie utilisateur. */
export function digitsOnly(value: string): string {
  return (value ?? "").replace(/\D/g, "");
}

/**
 * Extrait les 8 chiffres significatifs d'un numéro mobile béninois, quel que
 * soit le format de saisie : ancien format à 8 chiffres ("99992516"),
 * nouveau format local à 10 chiffres avec préfixe "01" introduit en 2024
 * ("0199992516"), variante à 9 chiffres si le 0 initial a été omis
 * ("199992516"), avec ou sans indicatif ("+229", "229", "00229") devant.
 *
 * Important : WhatsApp identifie les comptes par "+229" suivi des 8 chiffres
 * SANS le préfixe local "01" — c'est ce numéro à 8 chiffres que cette
 * fonction retourne (chaîne vide si le numéro ne peut pas être résolu).
 */
export function beninCoreDigits(value: string): string {
  let d = digitsOnly(value);
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("229") && d.length > 8) d = d.slice(3);

  if (d.length === 10 && d.startsWith("01")) d = d.slice(2);
  else if (d.length === 9 && (d.startsWith("0") || d.startsWith("1")))
    d = d.slice(1);

  return d.length === 8 ? d : "";
}

/** Validation d'un numéro mobile béninois, quel que soit le format de saisie. */
export function isValidBeninPhone(value: string): boolean {
  return beninCoreDigits(value).length === 8;
}

/** "0199992516" -> "01 99 99 25 16" (format local officiel, groupes de 2). */
export function formatBeninPhone(value: string): string {
  const core = beninCoreDigits(value);
  if (!core) return "";
  return `01 ${core.replace(/(\d{2})(?=\d)/g, "$1 ").trim()}`;
}

/** Numéro au format international utilisé par WhatsApp : "+229" + 8 chiffres, sans le préfixe local "01". */
export function toWhatsAppNumber(value: string): string {
  return `+229${beninCoreDigits(value)}`;
}

/** Masque un numéro pour l'affichage admin : "+229 61 •• •• 12". */
export function maskPhone(value: string): string {
  const core = beninCoreDigits(value);
  if (!core) return `+229 ${digitsOnly(value)}`;
  return `+229 ${core.slice(0, 2)} •• •• ${core.slice(-2)}`;
}
