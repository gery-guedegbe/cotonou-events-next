import { CountUp } from "@/components/ui/CountUp";

export function StatsSection() {
  return (
    <section className="border-y border-gray-100">
      <div className="mx-auto grid max-w-[1000px] grid-cols-3 px-5 py-10">
        <div className="border-r border-gray-200 text-center">
          <div className="text-[30px] font-extrabold tracking-[-0.02em] text-gray-900 md:text-[38px]">
            <CountUp to={84} suffix="+" />
          </div>

          <div className="mt-1 text-sm text-gray-500">Événements ce mois</div>
        </div>

        <div className="border-r border-gray-200 text-center">
          <div className="text-[30px] font-extrabold tracking-[-0.02em] text-gray-900 md:text-[38px]">
            <CountUp to={127} />
          </div>

          <div className="mt-1 text-sm text-gray-500">Abonnés WhatsApp</div>
        </div>

        <div className="text-center">
          <div className="text-[17px] font-extrabold tracking-[-0.02em] text-brand md:text-[21px]">
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
