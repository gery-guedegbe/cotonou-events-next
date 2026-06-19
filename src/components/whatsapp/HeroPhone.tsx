import { CalendarDays, Video, CheckCheck } from "lucide-react";

const ITEMS = [
  {
    n: 1,
    title: "Afro Nuit Live",
    meta: "Sam 17 mai · 20h · Haie-Vive · 5 000 F",
  },
  {
    n: 2,
    title: "Marché des Créateurs",
    meta: "Dim 18 mai · 10h · Centre-ville · Gratuit",
  },
  {
    n: 3,
    title: "Tournoi de football U17",
    meta: "Sam 17 mai · 15h · Akpakpa · Gratuit",
  },
];

/** Maquette d'iPhone minimaliste contenant l'aperçu du message hebdomadaire. */
export function HeroPhone() {
  return (
    <div className="relative flex justify-center">
      <div className="absolute h-[340px] w-[340px] animate-pulse rounded-full bg-brand-light opacity-60 blur-sm" />

      <div className="relative z-10 w-[272px] rounded-[40px] bg-gray-900 p-2.5 shadow-[0_30px_60px_rgba(0,0,0,0.22)]">
        <div className="overflow-hidden rounded-[32px] bg-whatsapp-bg">
          <div className="flex items-center gap-2.5 bg-whatsapp-header px-3.5 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand">
              <CalendarDays
                className="h-[18px] w-[18px] text-white"
                aria-hidden
              />
            </div>

            <div className="flex-1">
              <div className="text-sm font-bold text-white">Cotonou.events</div>
              <div className="text-[11px] text-white/70">en ligne</div>
            </div>

            <Video className="h-[18px] w-[18px] text-white/80" aria-hidden />
          </div>

          <div className="min-h-[300px] px-3 pb-4 pt-3.5">
            <div className="rounded-[12px_12px_0_12px] bg-whatsapp-bubble px-3 py-2.5 shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
              <div className="text-[13px] font-bold text-whatsapp-header">
                📅 Vos 7 événements du week-end
              </div>

              <div className="mt-1 text-[11.5px] leading-relaxed text-gray-700">
                Salut Koffi ! Voici ta sélection :
              </div>

              <div className="my-2.5 h-px bg-black/10" />

              <div className="flex flex-col gap-[7px] text-[11.5px] leading-relaxed text-gray-800">
                {ITEMS.map((it) => (
                  <div key={it.n}>
                    <b>
                      {it.n}. {it.title}
                    </b>
                    <br />
                    {it.meta}
                  </div>
                ))}
              </div>

              <div className="mt-2 text-[11px] font-semibold text-brand">
                + 4 autres · cotonou.events ↗
              </div>

              <div className="mt-1.5 flex items-center justify-end gap-1">
                <span className="text-[10px] text-[#667781]">Ven. 18:00</span>
                <CheckCheck
                  className="h-3.5 w-3.5 text-[#34B7F1]"
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
