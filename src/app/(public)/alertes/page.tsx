import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { AlertSubscribeForm } from "@/components/forms/AlertSubscribeForm";
import { WhatsAppDigest } from "@/components/whatsapp/WhatsAppDigest";
import { Accordion, type FaqItem } from "@/components/ui/Accordion";

export const metadata: Metadata = {
  title: "Recevez les alertes WhatsApp",
  description:
    "Gratuit, sans compte. Recevez les meilleurs événements de Cotonou chaque vendredi à 18h.",
  alternates: { canonical: "/alertes" },
};

const FAQ: FaqItem[] = [
  {
    q: "Quand est-ce que je recevrai le premier message ?",
    a: "Dès le prochain vendredi à 18h. Vous recevez un message par semaine, jamais plus.",
  },
  {
    q: "Puis-je modifier mes catégories ?",
    a: "Oui, à tout moment : répondez « CATEGORIES » à notre numéro WhatsApp et choisissez vos nouvelles préférences.",
  },
  {
    q: "Comment me désabonner ?",
    a: "Répondez simplement « STOP » à n'importe quel message. Votre numéro est immédiatement retiré de la liste.",
  },
  {
    q: "Mon numéro est-il en sécurité ?",
    a: "Absolument. Votre numéro sert uniquement à l'envoi des alertes Cotonou.events et n'est jamais partagé ni vendu.",
  },
];

export default function AlertesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-whatsapp-header to-[#128C7E] px-5 py-14">
        <div className="mx-auto max-w-[620px] text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
            <MessageCircle className="h-8 w-8 text-white" aria-hidden />
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-display text-white md:text-4xl">
            Recevez les alertes événements chaque vendredi
          </h1>

          <p className="mt-3 text-base text-white/75">
            Gratuit · Sans compte · Désabonnement en 1 mot
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[560px] px-5 pb-16 pt-10">
        <AlertSubscribeForm />

        <div className="mt-9 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <div className="mb-3.5 text-2xs font-bold uppercase tracking-label text-gray-500">
            Aperçu du message que vous recevrez
          </div>
          <div className="overflow-hidden rounded-xl">
            <WhatsAppDigest variant="full" />
          </div>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-xl font-extrabold tracking-title text-gray-900">
            Questions fréquentes
          </h2>
          <Accordion items={FAQ} />
        </div>
      </div>
    </>
  );
}
