"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";
interface Toast {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (t: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
} as const;

const ACCENT = {
  success: "#16A34A",
  error: "#EF4444",
  info: "#3B82F6",
} as const;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[120] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:items-end">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.variant];
            return (
              <motion.div
                key={t.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                className="pointer-events-auto flex items-center gap-3 rounded-xl border border-gray-200 bg-white py-3.5 pl-4 pr-5 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
                style={{ borderLeft: `4px solid ${ACCENT[t.variant]}` }}
              >
                <Icon className="h-[22px] w-[22px] flex-none" style={{ color: ACCENT[t.variant] }} aria-hidden />
                <div>
                  <div className="text-sm font-bold text-gray-900">{t.title}</div>
                  {t.description && <div className="text-[13px] text-gray-500">{t.description}</div>}
                </div>
                <button
                  onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                  aria-label="Fermer"
                  className="ml-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
