import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  organizationSchema,
  websiteSchema,
  jsonLdString,
} from "@/lib/seo/schema";
import "./globals.css";

// JetBrains Mono ne sert qu'à deux tableaux du dashboard admin. Elle est
// chargée dans app/admin/layout.tsx, pas ici : la charger globalement
// imposait un téléchargement de police à chaque visiteur du site public
// pour un rendu qu'aucune page publique n'utilise.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const SITE_NAME = "Cotonou.events";
const SITE_DESCRIPTION =
  "Chaque vendredi à 18h, recevez les 7 meilleurs événements du week-end à Cotonou directement sur WhatsApp. Gratuit, sans application.";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — L'agenda WhatsApp des événements de Cotonou`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL("https://cotonou.events"),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Les meilleurs événements de Cotonou, chaque vendredi sur WhatsApp.",
    url: "/",
    locale: "fr_BJ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Les meilleurs événements de Cotonou, chaque vendredi sur WhatsApp.",
  },
};

// L'organisation manquait : sans elle, aucune entité éditrice n'était
// déclarée, et les moteurs génératifs n'avaient rien à citer comme source.
const jsonLd = [organizationSchema(), websiteSchema()];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={jakarta.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[200] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2.5 focus:text-white"
        >
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
