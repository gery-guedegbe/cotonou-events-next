"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/evenements", label: "Événements" },
  { href: "/#comment", label: "Comment ça marche" },
  { href: "/soumettre", label: "Soumettre un événement" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 border-b bg-white transition-[box-shadow,border-color] duration-150",
        scrolled
          ? "border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
          : "border-gray-100",
      )}
    >
      <div className="mx-auto flex h-16 max-w-container items-center justify-between gap-5 px-5">
        <Logo />

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand",
                pathname === l.href ? "text-brand" : "text-gray-700",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/alertes"
            className="hidden items-center rounded-pill bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover md:inline-flex"
          >
            Recevoir les alertes
          </Link>

          <button
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-900 hover:bg-gray-100 md:hidden"
          >
            <Menu className="h-6 w-6" aria-hidden />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/50"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute bottom-0 right-0 top-0 flex w-[78%] max-w-[320px] flex-col gap-2 bg-white p-5 shadow-[-8px_0_24px_rgba(0,0,0,0.12)]"
            >
              <div className="mb-2 flex h-11 items-center justify-between">
                <Logo />

                <button
                  onClick={() => setOpen(false)}
                  aria-label="Fermer le menu"
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-900 hover:bg-gray-100"
                >
                  <X className="h-6 w-6" aria-hidden />
                </button>
              </div>

              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex h-12 items-center border-b border-gray-100 text-base font-semibold text-gray-900"
                >
                  {l.label}
                </Link>
              ))}

              <Link
                href="/alertes"
                className="mt-3 rounded-pill bg-brand py-3 text-center text-base font-semibold text-white"
              >
                Recevoir les alertes
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
