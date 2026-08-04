import { z } from "zod";
import { isValidBeninPhone } from "@/lib/utils/format-phone";

const phoneDigits = z
  .string()
  .min(1, "Le numéro est requis")
  .refine((v) => isValidBeninPhone(v), {
    message: "Numéro béninois invalide",
  });

/**
 * Champs communs aux deux parcours d'inscription. Le consentement n'y figure
 * pas : il est recueilli différemment selon le contexte, et le mélanger au
 * socle avait produit une situation où le formulaire inline forçait
 * `consent: true` dans ses valeurs par défaut. La contrainte Zod passait donc
 * toujours, sans que le visiteur ait rien accepté.
 */
const subscribeBase = {
  prenom: z.string().min(2, "Votre prénom est requis"),
  phone: phoneDigits,
  categories: z.array(z.string()).default([]),
};

/**
 * Formulaire inline (hero, CTA, sidebar). Le consentement passe par une
 * mention explicite placée au point de soumission : l'envoi du formulaire est
 * l'acte positif, la mention en donne la portée. Pas de case à cocher, qui
 * ferait chuter la conversion sur un formulaire à deux champs.
 */
export const inlineSubscribeSchema = z.object(subscribeBase);

/**
 * Page /alertes. Formulaire long et délibéré : la case à cocher explicite y
 * est à sa place et constitue la preuve d'opt-in la plus solide.
 */
export const alertSubscribeSchema = z.object({
  ...subscribeBase,
  consent: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter pour vous abonner" }),
  }),
});

export type InlineSubscribeInput = z.input<typeof inlineSubscribeSchema>;
export type AlertSubscribeInput = z.input<typeof alertSubscribeSchema>;
export type AlertSubscribeValues = z.output<typeof alertSubscribeSchema>;

/** Conservé pour les appelants existants du formulaire inline. */
export type SubscribeValues = z.output<typeof inlineSubscribeSchema>;
