import Link from "next/link";
import { SubscribeForm } from "@/components/forms/SubscribeForm";
import { subscriberCtaLine } from "@/lib/utils/social-proof";

export function CtaSection({ subscribers }: { subscribers: number }) {
  return (
    <section className="bg-gray-900 py-20">
      <div className="mx-auto max-w-[620px] px-5 text-center">
        <h2 className="text-3xl font-extrabold tracking-display text-white">
          Prêt à ne plus rien rater ?
        </h2>

        <p className="mt-3 text-base text-white/80">
          {subscriberCtaLine(subscribers)}
        </p>

        <div className="mt-7 flex justify-center [&>form]:max-w-none [&>form]:flex-1">
          <SubscribeForm dark buttonLabel="Recevoir les alertes WhatsApp" />
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
