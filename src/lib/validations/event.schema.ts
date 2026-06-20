import { z } from "zod";
import { CATEGORY_NAMES } from "@/lib/constants/categories";
import { QUARTIERS } from "@/lib/constants/quartiers";

export const eventStep1Schema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(100, "100 caractères maximum"),
  category: z.enum(CATEGORY_NAMES as [string, ...string[]], {
    errorMap: () => ({ message: "Choisissez une catégorie" }),
  }),
  description: z
    .string()
    .min(50, "Au moins 50 caractères")
    .max(500, "500 caractères maximum"),
  priceType: z.enum(["gratuit", "payant"], {
    errorMap: () => ({
      message: "Indiquez si l'événement est gratuit ou payant",
    }),
  }),
  amount: z.string().optional(),
  link: z.string().url("Lien invalide").optional().or(z.literal("")),
});

export const eventStep2Schema = z.object({
  dateStart: z.string().min(1, "La date de début est requise"),
  timeStart: z.string().min(1, "L'heure de début est requise"),
  dateEnd: z.string().optional(),
  timeEnd: z.string().optional(),
  address: z.string().min(1, "L'adresse est requise"),
  quartier: z.enum(QUARTIERS as unknown as [string, ...string[]], {
    errorMap: () => ({ message: "Choisissez un quartier" }),
  }),
  /** Renseigné quand quartier === "Autre" : nom réel du quartier, saisi librement. */
  quartierAutre: z.string().optional(),
});

/** Si "Autre" est choisi, le nom réel du quartier devient obligatoire. */
export function quartierRefine(
  data: { quartier: string; quartierAutre?: string },
  ctx: z.RefinementCtx,
) {
  if (data.quartier === "Autre" && !data.quartierAutre?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["quartierAutre"],
      message: "Précisez le nom du quartier",
    });
  }
}

export const eventStep3Schema = z.object({
  org: z.string().min(1, "Le nom de l'organisateur est requis"),
  phone: z
    .string()
    .min(1, "Le numéro est requis")
    .refine((v) => v.replace(/\D/g, "").length >= 8, "Numéro invalide"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  orgFb: z.string().url("Lien invalide").optional().or(z.literal("")),
  consent1: z.literal(true, {
    errorMap: () => ({
      message: "Vous devez attester l'authenticité de l'événement",
    }),
  }),
  consent2: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions" }),
  }),
});

export const eventSchema = eventStep1Schema
  .merge(eventStep2Schema)
  .merge(eventStep3Schema)
  .superRefine(quartierRefine);

export type EventFormValues = z.infer<typeof eventSchema>;
