import Link from "next/link";
import { Plus } from "lucide-react";

export function OrganizersSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[620px] px-5 text-center">
        <h2 className="text-2xl font-extrabold tracking-title text-gray-900">
          Vous organisez des événements ?
        </h2>

        {/* Le mécanisme concret plutôt qu'une promesse d'audience : le site
            ne peut pas garantir une portée, il peut garantir une publication
            immédiate et une reprise dans le digest du vendredi. */}
        <p className="mt-2.5 text-base text-gray-600">
          Votre événement apparaît dans le catalogue dès l&apos;envoi du
          formulaire. Aucun délai de validation, aucun frais.
        </p>

        <div className="mt-7 rounded-2xl border border-gray-200 bg-gray-50 px-7 py-9">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-light">
            <Plus className="h-[30px] w-[30px] text-brand" aria-hidden />
          </div>

          <h3 className="mt-5 text-lg font-bold text-gray-900">
            Soumettre un événement
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Votre événement est mis en ligne immédiatement, et repris dans
            l&apos;alerte WhatsApp du vendredi s&apos;il a lieu le week-end.
          </p>

          <Link
            href="/soumettre"
            className="mt-5 inline-block rounded-pill bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Soumettre gratuitement
          </Link>

          <div className="mt-3.5 text-xs text-gray-500">
            Mise en ligne immédiate · Diffusion gratuite
          </div>
        </div>
      </div>
    </section>
  );
}
