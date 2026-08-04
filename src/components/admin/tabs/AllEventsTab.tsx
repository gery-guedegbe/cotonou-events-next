"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Check, EyeOff, Eye } from "lucide-react";
import type { AdminEventListItem } from "@/lib/supabase/admin";
import { CATEGORIES } from "@/lib/constants/categories";
import { approveEvent, unpublishEvent } from "@/lib/actions/admin-events";
import { cn } from "@/lib/utils/cn";
import { useToast } from "@/components/ui/Toast";

const STATUT_BADGE: Record<string, string> = {
  en_attente: "bg-amber-100 text-amber-800",
  publie: "bg-brand-light text-brand-fg",
  rejete: "bg-red-100 text-red-800",
};

const STATUT_LABEL: Record<string, string> = {
  en_attente: "En attente",
  publie: "Publié",
  rejete: "Rejeté",
};

export function AllEventsTab({ events }: { events: AdminEventListItem[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const rows = events.filter(
    (e) => !query || `${e.title} ${e.venue}`.toLowerCase().includes(query.toLowerCase()),
  );

  const toggle = async (e: AdminEventListItem) => {
    setBusyId(e.id);
    const result = e.statut === "publie" ? await unpublishEvent(e.id) : await approveEvent(e.id);
    setBusyId(null);

    if (!result.ok) {
      toast({ variant: "error", title: "Action impossible", description: result.error });
      return;
    }

    router.refresh();
  };

  return (
    <>
      <div className="relative mb-4 max-w-[420px]">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
          aria-hidden
        />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un événement…"
          className="h-[42px] w-full rounded-[10px] border-[1.5px] border-gray-200 bg-white pl-10 pr-3.5 text-sm outline-none focus:border-brand"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {["Titre", "Date", "Catégorie", "Statut", ""].map((h, i) => (
                  <th
                    key={h || i}
                    className={cn(
                      "px-4 py-3 text-2xs font-bold uppercase tracking-label text-gray-500",
                      i === 4 ? "text-right" : "text-left",
                    )}
                  >
                    {h || "Actions"}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((e) => (
                <tr key={e.id} className="border-t border-gray-100">
                  <td className="max-w-[280px] px-4 py-3.5 text-sm font-semibold text-gray-900">
                    <div className="truncate">{e.title}</div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-500">
                    {e.dateLabel}
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className="rounded-pill px-2.5 py-1 text-2xs font-bold"
                      style={{
                        background: CATEGORIES[e.category].bg,
                        color: CATEGORIES[e.category].text,
                      }}
                    >
                      {e.category}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        "rounded-pill px-2.5 py-1 text-2xs font-bold",
                        STATUT_BADGE[e.statut],
                      )}
                    >
                      {STATUT_LABEL[e.statut]}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/evenements/${e.id}`}
                        className="inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100"
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden /> Voir
                      </Link>

                      {e.statut === "publie" ? (
                        <button
                          disabled={busyId === e.id}
                          onClick={() => toggle(e)}
                          className="inline-flex items-center gap-1.5 rounded-pill border-[1.5px] border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
                        >
                          <EyeOff className="h-3.5 w-3.5" aria-hidden /> Dépublier
                        </button>
                      ) : (
                        <button
                          disabled={busyId === e.id}
                          onClick={() => toggle(e)}
                          className="inline-flex items-center gap-1.5 rounded-pill bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-hover disabled:opacity-50"
                        >
                          <Check className="h-3.5 w-3.5" aria-hidden /> Publier
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
