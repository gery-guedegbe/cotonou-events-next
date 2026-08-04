import type { Metadata } from "next";
import { SubmitEventForm } from "@/components/forms/SubmitEventForm";

export const metadata: Metadata = {
  title: "Soumettre un événement",
  description:
    "Soumettez gratuitement votre événement à Cotonou. Mise en ligne immédiate et diffusion dans l'alerte WhatsApp du vendredi.",
  alternates: { canonical: "/soumettre" },
};

export default function SoumettrePage() {
  return (
    <div className="mx-auto max-w-[680px] px-5 pb-20 pt-10">
      <h1 className="text-3xl font-extrabold tracking-display text-gray-900 md:text-4xl">
        Soumettre un événement
      </h1>

      <p className="mb-7 mt-2 text-base text-gray-500">
        Gratuit. Votre événement est publié dès l&apos;envoi du formulaire, et
        repris dans l&apos;alerte WhatsApp du vendredi s&apos;il a lieu le
        week-end.
      </p>

      <SubmitEventForm />
    </div>
  );
}
