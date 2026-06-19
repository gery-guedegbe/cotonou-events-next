import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { LEGAL_DOCS } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: LEGAL_DOCS.contact.title,
  description: LEGAL_DOCS.contact.intro,
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return <LegalPage slug="contact" />;
}
