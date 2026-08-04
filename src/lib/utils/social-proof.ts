/**
 * Formule la preuve sociale à partir du nombre réel d'abonnés.
 * Aucun chiffre inventé, aucun seuil : ce qui est affiché est ce qu'il y a en base.
 */
export function subscriberProofLine(subscribers: number): string {
  if (subscribers === 0) return "Soyez le premier inscrit";
  if (subscribers === 1) return "1 premier abonné";
  return `${subscribers.toLocaleString("fr-FR")} premiers abonnés`;
}

export function subscriberCtaLine(subscribers: number): string {
  if (subscribers === 0) {
    return "Soyez le premier à recevoir les meilleurs plans du week-end.";
  }
  const abonnes =
    subscribers === 1
      ? "le premier abonné"
      : `les ${subscribers.toLocaleString("fr-FR")} premiers abonnés`;
  return `Rejoignez ${abonnes} qui reçoivent les meilleurs plans chaque vendredi.`;
}
