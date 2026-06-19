import Link from "next/link";
import { Plus } from "lucide-react";

export function OrganizersSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[620px] px-5 text-center">
        <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-gray-900">
          Vous organisez des événements ?
        </h2>

        <p className="mt-2.5 text-[15px] text-gray-500">
          Soumettez vos événements gratuitement et touchez plus de monde.
        </p>

        <div className="mt-7 rounded-2xl border border-gray-200 bg-gray-50 px-7 py-9">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-light">
            <Plus className="h-[30px] w-[30px] text-brand" aria-hidden />
          </div>

          <h3 className="mt-[18px] text-lg font-bold text-gray-900">
            Soumettre un événement
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Votre événement validé en moins de 24h et diffusé à toute la
            communauté.
          </p>

          <Link
            href="/soumettre"
            className="mt-5 inline-block rounded-pill bg-brand px-[26px] py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Soumettre gratuitement
          </Link>

          <div className="mt-3.5 text-xs text-gray-400">
            Validation manuelle sous 24h · Diffusion gratuite
          </div>
        </div>
      </div>
    </section>
  );
}
