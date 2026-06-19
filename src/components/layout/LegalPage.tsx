import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { LEGAL_DOCS, type LegalSlug } from "@/lib/data/legal";

/** Gabarit éditorial partagé par toutes les pages légales/utilitaires. */
export function LegalPage({ slug }: { slug: LegalSlug }) {
  const doc = LEGAL_DOCS[slug];
  return (
    <div className="mx-auto max-w-[720px] px-5 pb-[72px] pt-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> Retour à l&apos;accueil
      </Link>

      <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-gray-900 md:text-[34px]">
        {doc.title}
      </h1>

      <p className="mt-3 text-[15px] leading-relaxed text-gray-500">
        {doc.intro}
      </p>

      <div className="mt-2.5 text-xs text-gray-400">
        Dernière mise à jour : 1er mai 2025
      </div>

      <div className="my-8 h-px bg-gray-200" />

      <div className="flex flex-col gap-[30px]">
        {doc.sections.map((s) => (
          <div key={s.h}>
            <h2 className="mb-2.5 text-lg font-bold text-gray-900">{s.h}</h2>

            <p className="text-[15px] leading-relaxed text-gray-700">
              {s.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3.5 rounded-2xl border border-brand-light bg-[#F0FDF4] p-[22px]">
        <Mail className="h-[22px] w-[22px] text-brand" aria-hidden />

        <div className="min-w-[180px] flex-1">
          <div className="text-[14.5px] font-bold text-gray-900">
            Une question ?
          </div>

          <div className="text-[13.5px] text-gray-700">
            Écrivez-nous à contact@cotonou.events
          </div>
        </div>

        <Link
          href="/alertes"
          className="rounded-pill bg-brand px-[18px] py-2.5 text-[13.5px] font-semibold text-white"
        >
          Recevoir les alertes
        </Link>
      </div>
    </div>
  );
}
