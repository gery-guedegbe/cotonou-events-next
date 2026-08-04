"use client";

import { forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { isValidBeninPhone } from "@/lib/utils/format-phone";

interface PhoneInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  error?: string;
  /** Thème sombre (sections fond foncé du CTA / hero alertes). */
  dark?: boolean;
}

/** Champ téléphone béninois avec préfixe drapeau + indicatif fixe +229. */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  function PhoneInput({ className, error, dark, value, ...props }, ref) {
    const valid = isValidBeninPhone(String(value ?? ""));

    return (
      <div
        className={cn(
          "flex h-11 items-stretch overflow-hidden rounded-lg border-[1.5px] transition-colors",
          dark ? "border-white/15 bg-white/[0.08]" : "bg-white",
          !dark && (valid ? "border-brand" : "border-gray-200"),
          !dark && error && "border-red-500",
          className,
        )}
      >
        <div
          className={cn(
            "flex items-center gap-1.5 whitespace-nowrap border-r px-3 text-base",
            dark
              ? "border-white/15 bg-white/[0.06] text-white/80"
              : "border-gray-200 bg-gray-50 text-gray-700",
          )}
        >
          <span aria-hidden>🇧🇯</span> +229
        </div>

        <input
          ref={ref}
          type="tel"
          value={value}
          inputMode="numeric"
          placeholder="01 XX XX XX XX"
          className={cn(
            "min-w-0 flex-1 border-0 bg-transparent px-3 text-base outline-none",
            dark
              ? "text-white placeholder:text-white/70"
              : "text-gray-900 placeholder:text-gray-500",
          )}
          {...props}
        />

        {!dark && (
          <div className="flex items-center pr-3">
            <Check
              className={cn(
                "h-[18px] w-[18px] text-brand transition-opacity",
                valid ? "opacity-100" : "opacity-0",
              )}
              aria-hidden
            />
          </div>
        )}
      </div>
    );
  },
);
