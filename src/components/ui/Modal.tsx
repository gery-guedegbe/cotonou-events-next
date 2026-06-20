"use client";

import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function Modal({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  danger,
  onConfirm,
  onClose,
}: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-[420px] rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
          >
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            {description && (
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {description}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={onClose}>
                Annuler
              </Button>

              <Button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={danger ? "bg-red-500 hover:bg-red-600" : undefined}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
