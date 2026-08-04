import { CountUp } from "@/components/ui/CountUp";
import type { PublicStats } from "@/lib/supabase/stats";

/** Compteurs branchés sur la base. Aucun chiffre en dur, aucun seuil d'affichage. */
function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-extrabold tracking-title text-gray-900 md:text-4xl">
        <CountUp to={value} />
      </div>

      <div className="mt-1 text-sm text-gray-500">{label}</div>
    </div>
  );
}

export function StatsSection({ stats }: { stats: PublicStats }) {
  return (
    <section className="border-y border-gray-100">
      <div className="mx-auto grid max-w-[1000px] grid-cols-3 divide-x divide-gray-200 px-5 py-10">
        <Stat value={stats.upcomingEvents} label="Événements à venir" />

        <Stat value={stats.subscribers} label="Abonnés WhatsApp" />

        <div className="text-center">
          <div className="text-lg font-extrabold tracking-title text-brand md:text-xl">
            Chaque vendredi
          </div>

          <div className="mt-1 text-sm text-gray-500">
            Alertes envoyées à 18h
          </div>
        </div>
      </div>
    </section>
  );
}
