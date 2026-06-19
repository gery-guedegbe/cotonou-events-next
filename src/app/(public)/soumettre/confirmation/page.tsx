"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ConfirmationPage() {
  return (
    <div className="mx-auto max-w-[680px] px-5 pb-[72px] pt-10">
      <div className="rounded-2xl border border-gray-200 bg-white px-7 py-14 text-center shadow-card">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-light"
        >
          <CheckCircle2 className="h-12 w-12 text-brand" aria-hidden />
        </motion.div>

        <h2 className="mt-6 text-2xl font-extrabold tracking-[-0.02em] text-gray-900">
          Votre événement est bien reçu
        </h2>

        <p className="mx-auto mt-3 max-w-[380px] text-[15px] leading-relaxed text-gray-500">
          Il sera vérifié et publié dans les 24h. Vous recevrez une confirmation
          par WhatsApp ou email.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/evenements"
            className="rounded-pill bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Retour aux événements
          </Link>

          <Link href="/soumettre">
            <Button variant="secondary">Soumettre un autre événement</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
