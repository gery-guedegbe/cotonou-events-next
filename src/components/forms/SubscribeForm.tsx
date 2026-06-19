"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  subscribeSchema,
  type SubscribeInput,
  type SubscribeValues,
} from "@/lib/validations/subscribe.schema";
import { subscribeToAlerts } from "@/lib/actions/subscribers";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";

interface SubscribeFormProps {
  /** Thème sombre pour la section CTA finale. */
  dark?: boolean;
  buttonLabel?: string;
  onSuccess?: (values: SubscribeValues) => void;
}

/** Formulaire inline rapide (prénom + téléphone) — hero, CTA, sidebar détail. */
export function SubscribeForm({
  dark,
  buttonLabel = "Recevoir les alertes",
  onSuccess,
}: SubscribeFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SubscribeInput>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      prenom: "",
      phone: "",
      categories: [],
      consent: true as const,
    },
  });

  const phone = watch("phone");

  const onSubmit = handleSubmit(async (raw) => {
    setLoading(true);
    const result = await subscribeToAlerts({
      prenom: raw.prenom,
      phone: raw.phone,
      categories: raw.categories ?? [],
    });
    setLoading(false);

    if (!result.ok) {
      toast({ variant: "error", title: "Inscription impossible", description: result.error });
      return;
    }

    reset();
    onSuccess?.(raw as SubscribeValues);
    toast({
      variant: "success",
      title: "Inscription enregistrée !",
      description: "Premier message ce vendredi à 18h.",
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex max-w-[480px] flex-col gap-2.5">
      <div className="flex flex-wrap gap-2.5">
        <div className="sm:flex-1">
          <Input
            {...register("prenom")}
            aria-label="Votre prénom"
            placeholder="Votre prénom"
            className={cn(
              "h-12",
              dark &&
                "border-white/15 bg-white/[0.08] text-white placeholder:text-white/40 focus:border-brand focus:shadow-none",
            )}
          />
        </div>

        <div className="sm:flex-[2]">
          <PhoneInput
            {...register("phone")}
            value={phone}
            dark={dark}
            className="h-12"
          />
        </div>

        {/* 
        <PhoneInput
          {...register("phone")}
          value={phone}
          dark={dark}
          className="h-12"
        /> */}
      </div>

      <Button type="submit" size="lg" loading={loading}>
        {buttonLabel}
      </Button>

      {(errors.prenom || errors.phone) && (
        <FieldError>
          {errors.prenom?.message ?? errors.phone?.message}
        </FieldError>
      )}

      {!dark && (
        <div className="flex items-center gap-[7px] text-xs text-gray-400">
          <Shield className="h-3.5 w-3.5 flex-none" aria-hidden />
          <span>
            Votre numéro n&apos;est jamais partagé · Répondez STOP pour vous
            désabonner à tout moment.
          </span>
        </div>
      )}
    </form>
  );
}
