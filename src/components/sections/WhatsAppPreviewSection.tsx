import { CheckCircle2 } from "lucide-react";
import { WhatsAppDigest } from "@/components/whatsapp/WhatsAppDigest";

const POINTS = [
  "7 événements sélectionnés pour vous",
  "Date, heure, lieu et prix en un coup d'œil",
  "Lien direct vers le site pour les détails",
  "Répondez STOP pour vous désabonner",
];

export function WhatsAppPreviewSection() {
  return (
    <section className="bg-[#F0FDF4] py-20">
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 px-5 md:grid-cols-2">
        <div>
          <span className="inline-flex rounded-pill bg-brand-light px-3 py-1.5 text-xs font-semibold text-brand-fg">
            Exemple d&apos;alerte hebdo
          </span>

          <h2 className="mt-[18px] text-[28px] font-extrabold tracking-[-0.03em] text-gray-900">
            Ce que vous recevez chaque vendredi
          </h2>

          <p className="mt-3.5 max-w-[440px] text-base leading-relaxed text-gray-500">
            Un résumé clair des meilleurs événements du week-end, personnalisé
            selon vos catégories favorites. Un seul message, tout y est.
          </p>

          <div className="mt-5 flex flex-col gap-3.5">
            {POINTS.map((p) => (
              <div key={p} className="flex items-start gap-3">
                <CheckCircle2
                  className="h-5 w-5 flex-none text-brand"
                  aria-hidden
                />

                <span className="text-[15px] text-gray-700">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-[18px] shadow-[0_20px_50px_rgba(0,0,0,0.14)]">
          <WhatsAppDigest variant="full" />
        </div>
      </div>
    </section>
  );
}
