"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";
import { CATEGORY_NAMES, CATEGORIES } from "@/lib/constants/categories";
import { isValidBeninPhone } from "@/lib/utils/format-phone";
import { subscribeToAlerts } from "@/lib/actions/subscribers";
import { cn } from "@/lib/utils/cn";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FieldLabel, FieldError } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";

const TOGGLES = [...CATEGORY_NAMES, "Tout recevoir"];

export function AlertSubscribeForm() {
  const [prenom, setPrenom] = useState("");
  const [phone, setPhone] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const toggleCat = (name: string) => {
    setCats((prev) => {
      if (name === "Tout recevoir")
        return prev.includes(name) ? [] : ["Tout recevoir"];
      const base = prev.filter((c) => c !== "Tout recevoir");
      return base.includes(name)
        ? base.filter((c) => c !== name)
        : [...base, name];
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prenom.trim().length < 2) return setError("Votre prénom est requis");
    if (!isValidBeninPhone(phone)) return setError("Numéro béninois invalide");
    if (!consent) return setError("Vous devez accepter pour vous abonner");
    setError("");
    setLoading(true);
    const result = await subscribeToAlerts({ prenom, phone, categories: cats });
    setLoading(false);
    if (!result.ok) return setError(result.error);
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-brand-light bg-[#F0FDF4] px-7 py-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-brand-light"
        >
          <CheckCircle2 className="h-11 w-11 text-brand" aria-hidden />
        </motion.div>

        <h2 className="mt-[22px] text-[22px] font-extrabold text-gray-900">
          Vous êtes abonné !
        </h2>

        <p className="mx-auto mt-2.5 max-w-[360px] text-[15px] leading-relaxed text-gray-500">
          Votre premier message arrive ce vendredi à 18h. À tout moment,
          répondez STOP pour vous désabonner.
        </p>

        <Link
          href="/evenements"
          className="mt-6 inline-block rounded-pill bg-brand px-6 py-3 text-sm font-semibold text-white"
        >
          Explorer les événements
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div>
        <FieldLabel htmlFor="prenom">Votre prénom</FieldLabel>

        <Input
          id="prenom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          placeholder="Ex : Koffi"
          className="h-12"
        />
      </div>

      <div>
        <FieldLabel>Numéro WhatsApp</FieldLabel>

        <PhoneInput
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-12"
        />
      </div>

      <div>
        <FieldLabel>Vos catégories favorites</FieldLabel>

        <div className="grid grid-cols-2 gap-2.5">
          {TOGGLES.map((name) => {
            const on = cats.includes(name);
            const icon =
              name === "Tout recevoir"
                ? null
                : CATEGORIES[name as keyof typeof CATEGORIES]?.icon;
            return (
              <button
                type="button"
                key={name}
                onClick={() => toggleCat(name)}
                className={cn(
                  "relative flex items-center gap-2.5 rounded-[10px] border-[1.5px] px-3.5 py-3 text-left",
                  on ? "border-brand bg-[#F0FDF4]" : "border-gray-200 bg-white",
                )}
              >
                {icon ? (
                  <Icon
                    name={icon}
                    className={cn(
                      "h-5 w-5 flex-none",
                      on ? "text-brand" : "text-gray-500",
                    )}
                    aria-hidden
                  />
                ) : (
                  <Sparkles
                    className={cn(
                      "h-5 w-5 flex-none",
                      on ? "text-brand" : "text-gray-500",
                    )}
                    aria-hidden
                  />
                )}

                <span className="text-sm font-semibold text-gray-900">
                  {name}
                </span>

                {on && (
                  <CheckCircle2
                    className="absolute right-3 h-[18px] w-[18px] text-brand"
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Checkbox checked={consent} onChange={setConsent}>
        J&apos;accepte de recevoir les alertes et la{" "}
        <Link href="/politique-de-confidentialite" className="text-brand">
          politique de confidentialité
        </Link>
        .
      </Checkbox>

      <FieldError>{error}</FieldError>

      <Button type="submit" size="lg" loading={loading} className="w-full">
        S&apos;abonner aux alertes
      </Button>

      <div className="flex items-center justify-center gap-[7px] text-xs text-gray-400">
        <Lock className="h-3.5 w-3.5" aria-hidden />
        <span>
          Numéro utilisé uniquement pour les alertes Cotonou.events · Jamais
          partagé.
        </span>
      </div>
    </form>
  );
}
