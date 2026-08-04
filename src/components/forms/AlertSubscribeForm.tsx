"use client";

import { useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { CheckCircle2, Lock } from "lucide-react";
import {
  alertSubscribeSchema,
  type AlertSubscribeInput,
} from "@/lib/validations/subscribe.schema";
import { subscribeToAlerts } from "@/lib/actions/subscribers";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FieldLabel, FieldError } from "@/components/ui/Field";
import { CategoryToggleGrid } from "@/components/forms/CategoryToggleGrid";

/** Confirmation affichée en place du formulaire une fois l'inscription faite. */
function SubscribedConfirmation() {
  return (
    <div className="rounded-2xl border border-brand-light bg-brand-light/30 px-7 py-12 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-brand-light"
      >
        <CheckCircle2 className="h-11 w-11 text-brand" aria-hidden />
      </motion.div>

      <h2 className="mt-6 text-2xl font-extrabold tracking-title text-gray-900">
        Vous êtes abonné
      </h2>

      <p className="mx-auto mt-2.5 max-w-[360px] text-base text-gray-600">
        Votre premier message arrive ce vendredi à 18h. À tout moment, répondez
        STOP pour vous désabonner.
      </p>

      <Link
        href="/evenements"
        className="mt-6 inline-flex h-11 items-center rounded-pill bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
      >
        Explorer les événements
      </Link>
    </div>
  );
}

/**
 * Parcours long de la page /alertes. Aligné sur React Hook Form + Zod comme
 * le reste des formulaires du projet : il validait auparavant à la main, avec
 * ses propres messages d'erreur et sans validation au blur.
 */
export function AlertSubscribeForm() {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AlertSubscribeInput>({
    resolver: zodResolver(alertSubscribeSchema),
    mode: "onBlur",
    defaultValues: { prenom: "", phone: "", categories: [] },
  });

  const phone = watch("phone");

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");
    const result = await subscribeToAlerts({
      prenom: values.prenom,
      phone: values.phone,
      categories: values.categories ?? [],
    });

    if (!result.ok) {
      setServerError(result.error);
      return;
    }

    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (done) return <SubscribedConfirmation />;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div>
        <FieldLabel htmlFor="prenom">Votre prénom</FieldLabel>

        <Input
          id="prenom"
          {...register("prenom")}
          placeholder="Ex : Koffi"
          className="h-12"
          aria-invalid={!!errors.prenom}
        />

        <FieldError>{errors.prenom?.message}</FieldError>
      </div>

      <div>
        <FieldLabel htmlFor="phone">Numéro WhatsApp</FieldLabel>

        <PhoneInput
          id="phone"
          {...register("phone")}
          value={phone}
          className="h-12"
          aria-invalid={!!errors.phone}
        />

        <FieldError>{errors.phone?.message}</FieldError>
      </div>

      <div>
        <FieldLabel>Vos catégories favorites</FieldLabel>

        <Controller
          control={control}
          name="categories"
          render={({ field }) => (
            <CategoryToggleGrid
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="consent"
        render={({ field }) => (
          <Checkbox
            name="consent"
            checked={field.value === true}
            onChange={field.onChange}
          >
            J&apos;accepte de recevoir un message WhatsApp par semaine et la{" "}
            <Link href="/politique-de-confidentialite" className="text-brand underline underline-offset-2">
              politique de confidentialité
            </Link>
            .
          </Checkbox>
        )}
      />

      <FieldError>{errors.consent?.message ?? serverError}</FieldError>

      <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
        Recevoir les alertes WhatsApp
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
        <Lock className="h-3.5 w-3.5 flex-none" aria-hidden />

        <span>
          Numéro utilisé uniquement pour les alertes Cotonou.events, jamais
          partagé.
        </span>
      </div>
    </form>
  );
}
