import { StatsCard } from "@/components/admin/StatsCard";
import { SubscribersChart } from "@/components/admin/SubscribersChart";
import type { RecentSubmission } from "@/lib/supabase/admin";
import { cn } from "@/lib/utils/cn";

const STATUS_BADGE: Record<string, string> = {
  "En attente": "bg-amber-100 text-amber-800",
  Publié: "bg-brand-light text-brand-fg",
  Rejeté: "bg-red-100 text-red-800",
};

interface OverviewTabProps {
  overview: {
    publishedCount: number;
    pendingCount: number;
    activeSubscribers: number;
    weekendCount: number;
  };
  recentSubmissions: RecentSubmission[];
  subscriberTrend: number[];
}

export function OverviewTab({
  overview,
  recentSubmissions,
  subscriberTrend,
}: OverviewTabProps) {
  const newSubscribers =
    subscriberTrend.length > 0
      ? subscriberTrend[subscriberTrend.length - 1] - subscriberTrend[0]
      : 0;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard
          label="Événements publiés"
          value={String(overview.publishedCount)}
          icon="calendar-check"
        />
        <StatsCard
          label="En attente"
          value={String(overview.pendingCount)}
          icon="clock"
          tone="amber"
        />
        <StatsCard
          label="Abonnés actifs"
          value={String(overview.activeSubscribers)}
          icon="users"
        />
        <StatsCard
          label="Ce week-end"
          value={String(overview.weekendCount)}
          icon="star"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-[15px] font-bold text-gray-900">
            Abonnés WhatsApp
          </div>

          <div className="mb-4 text-[13px] text-gray-500">
            30 derniers jours
            {newSubscribers !== 0 &&
              ` · ${newSubscribers > 0 ? "+" : ""}${newSubscribers} nouveaux`}
          </div>

          <SubscribersChart trend={subscriberTrend} />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-3.5 text-[15px] font-bold text-gray-900">
            Dernières soumissions
          </div>

          {recentSubmissions.length === 0 ? (
            <p className="text-sm text-gray-400">
              Aucune soumission pour l&apos;instant.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentSubmissions.map((r) => (
                <div key={r.title} className="flex items-center gap-[11px]">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-semibold text-gray-900">
                      {r.title}
                    </div>

                    <div className="text-xs text-gray-400">{r.when}</div>
                  </div>

                  <span
                    className={cn(
                      "rounded-pill px-2.5 py-1 text-[11px] font-bold",
                      STATUS_BADGE[r.status],
                    )}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
