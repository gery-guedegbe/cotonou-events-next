"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { useMemo } from "react";

const COLUMNS = [
  {
    title: "Navigation",
    links: [
      { href: "/", label: "Accueil" },
      { href: "/evenements", label: "Événements" },
      { href: "/soumettre", label: "Soumettre un événement" },
      { href: "/alertes", label: "Recevoir les alertes" },
    ],
  },
  {
    title: "Légal",
    links: [
      {
        href: "/politique-de-confidentialite",
        label: "Politique de confidentialité",
      },
      { href: "/conditions-utilisation", label: "Conditions d'utilisation" },
      { href: "/cookies", label: "Gestion des cookies" },
      { href: "/mentions-legales", label: "Mentions légales" },
    ],
  },
  {
    title: "Contact",
    links: [
      { href: "/a-propos", label: "À propos" },
      { href: "/contact", label: "Contact" },
      { href: "/signaler", label: "Signaler un problème" },
    ],
  },
];

export function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="bg-gray-900 pb-7 pt-12">
      <div className="mx-auto max-w-container px-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <Logo light />

            <p className="mt-3.5 max-w-[240px] text-[13px] leading-relaxed text-white/55">
              L&apos;agenda WhatsApp des événements de Cotonou. Chaque vendredi,
              les 7 meilleurs plans du week-end.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white/40">
                {col.title}
              </div>

              <div className="flex flex-col gap-[11px]">
                {col.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-6">
          <span className="text-xs text-white/35">
            © {currentYear} Cotonou.events · Fait avec soin au Bénin 🇧🇯
          </span>

          <span className="text-xs text-white/35">
            Données collectées : prénom &amp; numéro WhatsApp uniquement.
          </span>
        </div>
      </div>
    </footer>
  );
}
