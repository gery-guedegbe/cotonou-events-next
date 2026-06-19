"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const KEY = "cotonou_cookie";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  try {
    return localStorage.getItem(KEY) !== "1";
  } catch {
    return true;
  }
}

function getServerSnapshot() {
  return false;
}

export function CookieBanner() {
  const [dismissed, setDismissed] = useState(false);
  const notAccepted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const visible = notAccepted && !dismissed;

  const accept = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-[110] border-t border-gray-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
        >
          <div className="mx-auto flex max-w-container flex-wrap items-center gap-3.5 px-5 py-3.5">
            <Cookie className="h-5 w-5 flex-none text-brand" aria-hidden />

            <span className="min-w-[200px] flex-1 text-[13.5px] text-gray-700">
              Nous utilisons des cookies essentiels uniquement, pour faire
              fonctionner le site.
            </span>

            <Link
              href="/cookies"
              className="text-[13.5px] font-semibold text-brand"
            >
              En savoir plus
            </Link>

            <Button size="sm" onClick={accept}>
              Accepter
            </Button>

            <button
              onClick={accept}
              aria-label="Fermer"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
            >
              <X className="h-[18px] w-[18px]" aria-hidden />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
