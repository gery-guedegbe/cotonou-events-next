import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { LEGAL_DOCS } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: LEGAL_DOCS["mentions-legales"].title,
  description: LEGAL_DOCS["mentions-legales"].intro,
  alternates: { canonical: "/mentions-legales" },
};

export default function Page() {
  return <LegalPage slug="mentions-legales" />;
}
