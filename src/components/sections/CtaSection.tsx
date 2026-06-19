import Link from "next/link";
import { SubscribeForm } from "@/components/forms/SubscribeForm";

export function CtaSection() {
  return (
    <section className="bg-gray-900 py-20">
      <div className="mx-auto max-w-[620px] px-5 text-center">
        <h2 className="text-[32px] font-extrabold tracking-[-0.03em] text-white">
          Prêt à ne plus rien rater ?
        </h2>

        <p className="mt-3 text-base text-white/65">
          Rejoignez les 127 Cotonouens qui reçoivent les meilleurs plans chaque
          vendredi.
        </p>

        <div className="mt-7 flex justify-center [&>form]:max-w-none [&>form]:flex-1">
          <SubscribeForm dark buttonLabel="S'abonner gratuitement" />
        </div>

        <Link
          href="/soumettre"
          className="mt-5 inline-block text-sm text-white underline underline-offset-[3px]"
        >
          Vous organisez un événement ?
        </Link>
      </div>
    </section>
  );
}
