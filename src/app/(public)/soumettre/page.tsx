import type { Metadata } from "next";
import { SubmitEventForm } from "@/components/forms/SubmitEventForm";

export const metadata: Metadata = {
  title: "Soumettre un événement",
  description:
    "Soumettez gratuitement votre événement. Validation manuelle sous 24h.",
  alternates: { canonical: "/soumettre" },
};

export default function SoumettrePage() {
  return (
    <div className="mx-auto max-w-[680px] px-5 pb-[72px] pt-10">
      <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-gray-900 md:text-[32px]">
        Soumettre un événement
      </h1>

      <p className="mb-7 mt-2 text-[15px] text-gray-500">
        Votre événement sera visible en moins de 24h après validation.
      </p>

      <SubmitEventForm />
    </div>
  );
}
