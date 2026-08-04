"use client";

import { useState } from "react";
import { MessageCircle, Link as LinkIcon, Check } from "lucide-react";
import { SubscribeForm } from "@/components/forms/SubscribeForm";

export function ShareCard({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    try {
      navigator.clipboard?.writeText(window.location.href);
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const waHref =
    typeof window !== "undefined"
      ? `https://wa.me/?text=${encodeURIComponent(`${title} — ${window.location.href}`)}`
      : "#";

  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-nav">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card">
        <div className="mb-3.5 text-base font-bold text-gray-900">
          Partager cet événement
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[46px] items-center justify-center gap-2.5 rounded-pill bg-whatsapp text-sm font-semibold text-white"
        >
          <MessageCircle className="h-[18px] w-[18px]" aria-hidden />
          Partager sur WhatsApp
        </a>

        <button
          onClick={copy}
          className="mt-2.5 flex h-[46px] w-full items-center justify-center gap-2.5 rounded-pill border-[1.5px] border-gray-200 bg-white text-sm font-semibold text-gray-700 transition-colors hover:border-brand hover:text-brand"
        >
          {copied ? (
            <Check className="h-[18px] w-[18px]" aria-hidden />
          ) : (
            <LinkIcon className="h-[18px] w-[18px]" aria-hidden />
          )}
          {copied ? "Lien copié !" : "Copier le lien"}
        </button>
      </div>

      <div className="rounded-2xl border border-brand-light bg-[#F0FDF4] p-5">
        <div className="text-base font-bold text-gray-900">
          Ne ratez plus d&apos;événements comme celui-ci
        </div>

        <p className="mb-3.5 mt-1.5 text-sm text-gray-500">
          Recevez les meilleurs plans chaque vendredi sur WhatsApp.
        </p>

        <SubscribeForm buttonLabel="Recevoir les alertes WhatsApp" />
      </div>
    </aside>
  );
}
