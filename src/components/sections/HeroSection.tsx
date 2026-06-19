import { Star } from "lucide-react";
import { SubscribeForm } from "@/components/forms/SubscribeForm";
import { HeroPhone } from "@/components/whatsapp/HeroPhone";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-container items-center gap-9 px-5 py-9 md:min-h-[560px] md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:py-16">
        <div className="max-w-[560px]">
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand-light px-3 py-1.5 text-xs font-semibold text-brand-fg">
            <span className="h-[7px] w-[7px] animate-pulse-dot rounded-full bg-brand" />
            Cotonou, Bénin · Gratuit
          </span>

          <h1 className="mt-[18px] text-[34px] font-extrabold leading-[1.07] tracking-[-0.035em] text-gray-900 md:text-5xl">
            Ne ratez plus aucun événement à Cotonou
          </h1>

          <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-gray-500 md:text-[17px]">
            Chaque vendredi à 18h, recevez les 7 meilleurs événements du
            week-end directement sur WhatsApp. Gratuit, sans application à
            installer.
          </p>

          <div className="mt-6">
            <SubscribeForm buttonLabel="Recevoir les alertes chaque vendredi" />
          </div>

          <div className="mt-6 flex items-center gap-3.5">
            <div className="flex">
              <div className="h-[34px] w-[34px] rounded-full border-2 border-white bg-gradient-to-br from-[#FDE68A] to-[#F59E0B]" />
              <div className="-ml-3 h-[34px] w-[34px] rounded-full border-2 border-white bg-gradient-to-br from-[#BFDBFE] to-[#3B82F6]" />
              <div className="-ml-3 h-[34px] w-[34px] rounded-full border-2 border-white bg-gradient-to-br from-[#BBF7D0] to-[#16A34A]" />
            </div>

            <div>
              <div className="flex gap-0.5 text-[#F59E0B]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-[#F59E0B]"
                    aria-hidden
                  />
                ))}
              </div>

              <div className="mt-0.5 text-[13.5px] font-medium text-gray-700">
                <b className="text-gray-900">127 Cotonouens</b> déjà abonnés
              </div>
            </div>
          </div>
        </div>

        <HeroPhone />
      </div>
    </section>
  );
}
