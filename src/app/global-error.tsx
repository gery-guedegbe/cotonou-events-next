"use client";

import { useEffect } from "react";
// global-error remplace entièrement le layout racine quand celui-ci échoue :
// il doit donc porter ses propres <html>/<body> et réimporter les styles,
// sans quoi la page de secours s'afficherait sans aucune mise en forme.
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global] erreur fatale", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <div className="mx-auto flex min-h-screen max-w-[520px] flex-col items-center justify-center px-5 text-center">
          <h1 className="text-3xl font-extrabold tracking-display text-gray-900">
            Le site est momentanément indisponible
          </h1>

          <p className="mt-3 text-base text-gray-600">
            Une erreur inattendue s&apos;est produite. Réessayez dans quelques
            instants.
          </p>

          <button
            onClick={reset}
            className="mt-7 inline-flex h-11 items-center rounded-pill bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Recharger la page
          </button>

          {error.digest ? (
            <p className="mt-6 text-xs text-gray-500">
              Référence de l&apos;incident : {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
