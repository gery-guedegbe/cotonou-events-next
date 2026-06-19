import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { LEGAL_DOCS } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: LEGAL_DOCS.signaler.title,
  description: LEGAL_DOCS.signaler.intro,
  alternates: { canonical: "/signaler" },
};

export default function Page() {
  return <LegalPage slug="signaler" />;
}
