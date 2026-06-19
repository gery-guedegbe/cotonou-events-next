import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { LEGAL_DOCS } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: LEGAL_DOCS["politique-de-confidentialite"].title,
  description: LEGAL_DOCS["politique-de-confidentialite"].intro,
  alternates: { canonical: "/politique-de-confidentialite" },
};

export default function Page() {
  return <LegalPage slug="politique-de-confidentialite" />;
}
