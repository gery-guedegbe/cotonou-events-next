"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

/**
 * Frontière d'erreur des pages publiques. Affiche un message en français et
 * une action de reprise, jamais la stack trace : le message technique part
 * dans la console pour le diagnostic, pas à l'écran du visiteur.
 */
export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[public] erreur de rendu", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[520px] flex-col items-center justify-center px-5 py-24 text-center">
      <AlertTriangle
        className="h-14 w-14 text-gray-500"
        strokeWidth={1.5}
        aria-hidden
      />

      <h1 className="mt-6 text-3xl font-extrabold tracking-display text-gray-900 md:text-4xl">
        Cette page n&apos;a pas pu se charger
      </h1>

      <p className="mt-3 text-base text-gray-600">
        Le problème vient de nous, pas de vous. Réessayez dans un instant, ou
        revenez à l&apos;accueil.
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex h-11 items-center gap-2 rounded-pill bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          <RotateCw className="h-4 w-4" aria-hidden />
          Réessayer
        </button>

        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-pill border-[1.5px] border-gray-200 px-6 text-sm font-semibold text-gray-700 transition-colors hover:border-brand hover:text-brand"
        >
          Retour à l&apos;accueil
        </Link>
      </div>

      {error.digest ? (
        <p className="mt-6 text-xs text-gray-500">
          Référence de l&apos;incident : {error.digest}
        </p>
      ) : null}
    </div>
  );
}
