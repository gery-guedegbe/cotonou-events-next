"use client";

import { useState } from "react";
import { Search, EyeOff } from "lucide-react";
import { EVENTS } from "@/lib/data/events";
import { CATEGORIES } from "@/lib/constants/categories";
import { cn } from "@/lib/utils/cn";
import { Modal } from "@/components/ui/Modal";

export function PublishedTab() {
  const [query, setQuery] = useState("");
  const [unpublish, setUnpublish] = useState<string | null>(null);

  const rows = EVENTS.filter(
    (e) =>
      !query ||
      `${e.title} ${e.venue}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <div className="relative mb-4 max-w-[420px]">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
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
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {["Titre", "Date", "Catégorie", "Source", ""].map((h, i) => (
                  <th
                    key={h || i}
                    className={cn(
                      "px-4 py-3 text-[11px] font-bold uppercase tracking-[0.05em] text-gray-400",
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
                  <td className="max-w-[280px] px-4 py-3.5 text-[13.5px] font-semibold text-gray-900">
                    <div className="truncate">{e.title}</div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-gray-500">
                    {e.dateLabel}
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className="rounded-pill px-2.5 py-1 text-[11px] font-bold"
                      style={{
                        background: CATEGORIES[e.category].bg,
                        color: CATEGORIES[e.category].text,
                      }}
                    >
                      {e.category}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="rounded-pill bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-700">
                      {e.source}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => setUnpublish(e.id)}
                      className="inline-flex items-center gap-1.5 rounded-pill border-[1.5px] border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50"
                    >
                      <EyeOff className="h-3.5 w-3.5" aria-hidden /> Dépublier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={!!unpublish}
        title="Dépublier cet événement ?"
        description="Il ne sera plus visible sur le site public. Vous pourrez le republier depuis l'historique."
        confirmLabel="Dépublier"
        danger
        onConfirm={() => undefined}
        onClose={() => setUnpublish(null)}
      />
    </>
  );
}
