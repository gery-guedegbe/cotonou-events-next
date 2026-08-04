import { CalendarDays, CheckCheck } from "lucide-react";

interface DigestLine {
  emoji: string;
  title: string;
  meta: string;
}

const LINES: DigestLine[] = [
  {
    emoji: "🎵",
    title: "Afro Nuit Live",
    meta: "Sam 17 mai · 20h · Haie-Vive · 5 000 F",
  },
  {
    emoji: "🎨",
    title: "Marché des Créateurs",
    meta: "Dim 18 mai · 10h · Centre-ville · Gratuit",
  },
  {
    emoji: "⚽",
    title: "Tournoi de football U17",
    meta: "Sam 17 mai · 15h · Akpakpa · Gratuit",
  },
];

/** En-tête de conversation WhatsApp authentique. */
function ChatHeader({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3 bg-whatsapp-header px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand">
        <CalendarDays className="h-5 w-5 text-white" aria-hidden />
      </div>

      <div>
        <div
          className={
            compact
              ? "text-sm font-bold text-white"
              : "text-base font-bold text-white"
          }
        >
          Cotonou.events
        </div>

        <div className="text-xs text-white/70">en ligne</div>
      </div>
    </div>
  );
}

/**
 * Bulle de digest WhatsApp. `variant="full"` (section aperçu / alertes) ou
 * `variant="mini"` (aperçu condensé dans le mockup téléphone du hero).
 */
export function WhatsAppDigest({
  variant = "full",
}: {
  variant?: "full" | "mini";
}) {
  const mini = variant === "mini";
  return (
    <div className="overflow-hidden">
      <ChatHeader compact={mini} />
      <div className="bg-whatsapp-bg px-3.5 pb-5 pt-4">
        <div className="rounded-[12px_12px_0_12px] bg-whatsapp-bubble p-3.5 shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
          <div className="text-sm font-bold text-whatsapp-header">
            📅 Vos événements du week-end
          </div>

          <div className="mt-1.5 text-sm text-gray-700">
            Bonjour Koffi 👋 Voici les meilleurs plans à Cotonou ce week-end :
          </div>

          <div className="my-2.5 h-px bg-black/10" />

          <div className="flex flex-col gap-2 text-sm leading-relaxed text-gray-800">
            {LINES.map((l) => (
              <div key={l.title}>
                <b>
                  {l.emoji} {l.title}
                </b>
                <br />
                {l.meta}
              </div>
            ))}
          </div>

          <div className="mt-2.5 text-xs font-semibold text-brand">
            👉 Voir les 7 événements : cotonou.events
          </div>

          <div className="mt-2 text-2xs text-[#667781]">
            Pour vous désabonner, répondez STOP.
          </div>

          <div className="mt-1.5 flex items-center justify-end gap-1">
            <span className="text-2xs text-[#667781]">Ven. 18:00</span>

            <CheckCheck
              className="h-[15px] w-[15px] text-[#34B7F1]"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}
