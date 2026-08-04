import { ShieldCheck, MessageCircle } from "lucide-react";
import { SubscribeForm } from "@/components/forms/SubscribeForm";
import { HeroPhone } from "@/components/whatsapp/HeroPhone";
import { subscriberProofLine } from "@/lib/utils/social-proof";

export function HeroSection({ subscribers }: { subscribers: number }) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-container items-center gap-9 px-5 py-9 md:min-h-[560px] md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:py-16">
        <div className="max-w-[560px]">
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand-light px-3 py-1.5 text-xs font-semibold text-brand-fg">
            <span className="h-[7px] w-[7px] animate-pulse-dot rounded-full bg-brand" />
            Cotonou, Bénin · Gratuit
          </span>

          <h1 className="mt-5 text-4xl font-extrabold tracking-display text-gray-900 md:text-5xl">
            Ne ratez plus aucun événement à Cotonou
          </h1>

          <p className="mt-4 max-w-[480px] text-base leading-relaxed text-gray-500 md:text-lg">
            Chaque vendredi à 18h, recevez les 7 meilleurs événements du
            week-end directement sur WhatsApp. Gratuit, sans application à
            installer.
          </p>

          <div className="mt-6">
            <SubscribeForm buttonLabel="Recevoir les alertes WhatsApp" />
          </div>

          {/* Réassurance factuelle plutôt qu'étoiles et avatars : le produit
              n'a ni avis collectés ni base d'abonnés à mettre en avant. */}
          <div className="mt-6 flex flex-col gap-2.5 text-sm text-gray-700">
            <div className="flex items-center gap-2.5">
              <MessageCircle
                className="h-4 w-4 flex-none text-brand"
                aria-hidden
              />
              <span>
                <b className="text-gray-900">{subscriberProofLine(subscribers)}</b>{" "}
                · un seul message par semaine
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <ShieldCheck
                className="h-4 w-4 flex-none text-brand"
                aria-hidden
              />
              <span>
                Votre numéro n&apos;est jamais partagé. Répondez STOP pour
                arrêter.
              </span>
            </div>
          </div>
        </div>

        <HeroPhone />
      </div>
    </section>
  );
}
