import { Check, X, Eye, CheckCircle2 } from "lucide-react";
import { CATEGORIES } from "@/lib/constants/categories";
import type { PendingEvent } from "@/lib/data/admin";

interface PendingTabProps {
  pending: PendingEvent[];
  onChange: (pending: PendingEvent[]) => void;
}

export function PendingTab({ pending, onChange }: PendingTabProps) {
  if (pending.length === 0) {
    return (
      <div className="py-20 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand" aria-hidden />

        <h3 className="mt-4 text-lg font-bold text-gray-900">
          Tout est à jour
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Aucun événement en attente de validation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {pending.map((p) => (
        <div
          key={p.id}
          className="flex flex-wrap items-start gap-4 rounded-2xl border border-gray-200 bg-white p-[18px]"
        >
          <div className="min-w-[220px] flex-1">
            <div className="text-base font-bold text-gray-900">{p.title}</div>

            <div className="mt-2.5 flex flex-wrap gap-2">
              <span
                className="rounded-pill px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.05em]"
                style={{
                  background: CATEGORIES[p.category].bg,
                  color: CATEGORIES[p.category].text,
                }}
              >
                {p.category}
              </span>

              <span className="rounded-pill bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-700">
                {p.source}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-[13px] text-gray-500">
              <span>📅 {p.date}</span>
              <span>📍 {p.lieu}</span>
              <span>
                👤 {p.organizer} · {p.contact}
              </span>
            </div>

            <div className="mt-2 text-xs text-gray-400">
              Soumis {p.submitted}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onChange(pending.filter((x) => x.id !== p.id))}
              className="inline-flex items-center gap-1.5 rounded-pill bg-brand px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-brand-hover"
            >
              <Check className="h-[15px] w-[15px]" aria-hidden /> Publier
            </button>

            <button
              onClick={() => onChange(pending.filter((x) => x.id !== p.id))}
              className="inline-flex items-center gap-1.5 rounded-pill border-[1.5px] border-red-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-red-500 hover:bg-red-50"
            >
              <X className="h-[15px] w-[15px]" aria-hidden /> Rejeter
            </button>

            <button className="inline-flex items-center gap-1.5 rounded-pill px-3 py-2.5 text-[13px] font-semibold text-gray-500 hover:bg-gray-100">
              <Eye className="h-[15px] w-[15px]" aria-hidden /> Voir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
