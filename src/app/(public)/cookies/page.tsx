import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { LEGAL_DOCS } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: LEGAL_DOCS.cookies.title,
  description: LEGAL_DOCS.cookies.intro,
  alternates: { canonical: "/cookies" },
};

export default function Page() {
  return <LegalPage slug="cookies" />;
}
