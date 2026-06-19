import { z } from "zod";
import { isValidBeninPhone } from "@/lib/utils/format-phone";

const phoneDigits = z
  .string()
  .min(1, "Le numéro est requis")
  .refine((v) => isValidBeninPhone(v), {
    message: "Numéro béninois invalide",
  });

export const subscribeSchema = z.object({
  prenom: z.string().min(2, "Votre prénom est requis"),
  phone: phoneDigits,
  categories: z.array(z.string()).default([]),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter pour vous abonner" }),
  }),
});

export type SubscribeInput = z.input<typeof subscribeSchema>;
export type SubscribeValues = z.output<typeof subscribeSchema>;
