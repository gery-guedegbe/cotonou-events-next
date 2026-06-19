import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[520px] flex-col items-center justify-center px-5 py-24 text-center">
      <SearchX
        className="h-16 w-16 text-gray-400"
        strokeWidth={1.5}
        aria-hidden
      />

      <h1 className="mt-6 text-[32px] font-extrabold tracking-[-0.03em] text-gray-900">
        Page introuvable
      </h1>

      <p className="mt-3 text-[15.5px] leading-relaxed text-gray-500">
        La page que vous cherchez n&apos;existe pas ou a été déplacée. Pas de
        panique, les meilleurs événements de Cotonou sont juste là.
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-pill bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          Retour à l&apos;accueil
        </Link>

        <Link href="/evenements">
          <Button variant="secondary">Voir les événements</Button>
        </Link>
      </div>
    </div>
  );
}
