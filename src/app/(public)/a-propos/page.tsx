import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { LEGAL_DOCS } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: LEGAL_DOCS["a-propos"].title,
  description: LEGAL_DOCS["a-propos"].intro,
  alternates: { canonical: "/a-propos" },
};

export default function Page() {
  return <LegalPage slug="a-propos" />;
}
