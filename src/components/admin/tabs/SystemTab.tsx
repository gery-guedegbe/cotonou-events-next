"use client";

import { useState } from "react";
import { RefreshCw, Send, MessageSquare, Database } from "lucide-react";
import { SYSTEM_LOGS } from "@/lib/data/admin";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export function SystemTab() {
  const [scrapeOpen, setScrapeOpen] = useState(false);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-[18px]">
          <div className="mb-3 flex items-center gap-2.5">
            <RefreshCw className="h-[18px] w-[18px] text-brand" aria-hidden />
            <span className="text-sm font-bold">Dernier run Apify</span>
          </div>

          <div className="text-[13px] leading-relaxed text-gray-500">
            Aujourd&apos;hui à 06:00
            <br />
            <b className="text-gray-900">12 ajoutés</b> ·{" "}
            <b className="text-gray-900">4 doublons</b>
            <br />
            <span className="font-bold text-brand">● Succès</span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-[18px]">
          <div className="mb-3 flex items-center gap-2.5">
            <Send className="h-[18px] w-[18px] text-brand" aria-hidden />

            <span className="text-sm font-bold">Prochain digest WhatsApp</span>
          </div>

          <div className="text-[13px] leading-relaxed text-gray-500">
            Vendredi 23 mai · 18:00
            <br />
            <b className="text-gray-900">127 destinataires</b>
            <br />
            <span className="font-bold text-amber-500">● Programmé</span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-[18px]">
          <div className="mb-3 flex items-center gap-2.5">
            <MessageSquare
              className="h-[18px] w-[18px] text-brand"
              aria-hidden
            />

            <span className="text-sm font-bold">Quota Meta WhatsApp</span>
          </div>

          <div className="mb-2 text-[13px] text-gray-500">
            218 / 1000 conversations
          </div>

          <div className="h-2 overflow-hidden rounded-pill bg-gray-100">
            <div className="h-full bg-brand" style={{ width: "22%" }} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-[18px]">
          <div className="mb-3 flex items-center gap-2.5">
            <Database className="h-[18px] w-[18px] text-brand" aria-hidden />

            <span className="text-sm font-bold">Base Supabase</span>
          </div>

          <div className="mb-2 text-[13px] text-gray-500">142 Mo / 500 Mo</div>

          <div className="h-2 overflow-hidden rounded-pill bg-gray-100">
            <div className="h-full bg-brand" style={{ width: "28%" }} />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Button variant="secondary" onClick={() => setScrapeOpen(true)}>
          <RefreshCw className="h-4 w-4" aria-hidden /> Relancer le scraper
          maintenant
        </Button>
      </div>

      <div className="mt-4">
        <div className="mb-2 text-[13px] font-semibold text-gray-700">
          Logs système
        </div>

        <div className="h-[200px] overflow-y-auto rounded-[10px] bg-gray-900 px-4 py-3.5 font-mono text-xs leading-relaxed text-[#4ADE80]">
          {SYSTEM_LOGS.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>

      <Modal
        open={scrapeOpen}
        title="Relancer le scraper ?"
        description="Le scraper Apify va analyser les pages Facebook et ajouter les nouveaux événements en attente de validation."
        confirmLabel="Relancer maintenant"
        onConfirm={() => undefined}
        onClose={() => setScrapeOpen(false)}
      />
    </>
  );
}
