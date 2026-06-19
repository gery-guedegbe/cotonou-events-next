import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { LEGAL_DOCS } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: LEGAL_DOCS["conditions-utilisation"].title,
  description: LEGAL_DOCS["conditions-utilisation"].intro,
  alternates: { canonical: "/conditions-utilisation" },
};

export default function Page() {
  return <LegalPage slug="conditions-utilisation" />;
}
