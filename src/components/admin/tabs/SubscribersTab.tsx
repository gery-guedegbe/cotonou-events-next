"use client";

import { Download } from "lucide-react";
import type { Subscriber } from "@/lib/types/subscriber.types";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";

function exportCsv(subscribers: Subscriber[]) {
  const rows = [
    ["Telephone", "Prenom", "Categories", "Inscrit", "Statut"],
    ...subscribers.map((s) => [
      s.phone,
      s.prenom,
      s.categories.join(" / "),
      s.date,
      s.active ? "Actif" : "Inactif",
    ]),
  ];
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "abonnes-cotonou-events.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function SubscribersTab({ subscribers }: { subscribers: Subscriber[] }) {
  const active = subscribers.filter((s) => s.active).length;
  const inactive = subscribers.length - active;
  const retention =
    subscribers.length > 0
      ? Math.round((active / subscribers.length) * 100)
      : 0;

  return (
    <>
      <div className="mb-[18px] grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-[18px]">
          <div className="text-[13px] text-gray-500">Abonnés actifs</div>

          <div className="mt-1.5 text-[26px] font-extrabold">{active}</div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-[18px]">
          <div className="text-[13px] text-gray-500">Désabonnés (STOP)</div>

          <div className="mt-1.5 text-[26px] font-extrabold">{inactive}</div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-[18px]">
          <div className="text-[13px] text-gray-500">Taux de rétention</div>

          <div className="mt-1.5 text-[26px] font-extrabold text-brand">
            {retention}%
          </div>
        </div>
      </div>

      <div className="mb-3 flex justify-end">
        <Button variant="secondary" onClick={() => exportCsv(subscribers)}>
          <Download className="h-[15px] w-[15px]" aria-hidden /> Exporter CSV
        </Button>
      </div>

      {subscribers.length === 0 ? (
        <div className="py-20 text-center text-sm text-gray-400">
          Aucun abonné pour l&apos;instant.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {[
                    "Téléphone",
                    "Prénom",
                    "Catégories",
                    "Inscrit",
                    "Statut",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.05em] text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id} className="border-t border-gray-100">
                    <td className="px-4 py-3.5 font-mono text-[13px] text-gray-700">
                      {s.phone}
                    </td>

                    <td className="px-4 py-3.5 text-[13.5px] font-semibold text-gray-900">
                      {s.prenom}
                    </td>

                    <td className="px-4 py-3.5 text-[13px] text-gray-500">
                      {s.categories.join(", ")}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-gray-500">
                      {s.date}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "rounded-pill px-2.5 py-1 text-[11px] font-bold",
                          s.active
                            ? "bg-brand-light text-brand-fg"
                            : "bg-gray-100 text-gray-500",
                        )}
                      >
                        {s.active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
