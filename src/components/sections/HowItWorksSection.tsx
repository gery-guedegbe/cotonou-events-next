import { Search, Bell, Calendar } from "lucide-react";

const STEPS = [
  {
    num: "01",
    Icon: Search,
    title: "Parcourez les événements",
    text: "Explorez tous les événements de Cotonou filtrés par catégorie, quartier et date.",
  },
  {
    num: "02",
    Icon: Bell,
    title: "Inscrivez-vous aux alertes",
    text: "Entrez votre numéro WhatsApp et vos préférences. Gratuit, sans compte à créer.",
  },
  {
    num: "03",
    Icon: Calendar,
    title: "Recevez chaque vendredi",
    text: "Les 7 meilleurs événements du week-end arrivent directement sur WhatsApp à 18h.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="comment" className="scroll-mt-20 bg-gray-50 py-20">
      <div className="mx-auto max-w-[1100px] px-5">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-display text-gray-900">
            Comment ça marche
          </h2>

          <p className="mt-2.5 text-base text-gray-600">
            De l&apos;inscription au premier message : moins d&apos;une minute.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className="rounded-2xl border border-gray-200 bg-white p-7"
            >
              <div className="mb-5 flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-base font-extrabold text-brand">
                  {s.num}
                </div>

                <s.Icon
                  className="h-[30px] w-[30px] text-brand"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>

              <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
