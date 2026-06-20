"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** "square" (cases à cocher) ou "round" (radios). */
  shape?: "square" | "round";
  children?: React.ReactNode;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  shape = "square",
  children,
  className,
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-2.5 text-sm text-gray-700",
        className,
      )}
    >
      <span
        className={cn(
          "mt-px flex h-[18px] w-[18px] flex-none items-center justify-center border-[1.5px] transition-colors",
          shape === "square" ? "rounded-[5px]" : "rounded-full",
          checked ? "border-brand bg-brand" : "border-gray-300 bg-white",
        )}
      >
        {shape === "square" ? (
          <Check
            className={cn(
              "h-3 w-3 text-white",
              checked ? "opacity-100" : "opacity-0",
            )}
            aria-hidden
          />
        ) : (
          <span
            className={cn(
              "h-[9px] w-[9px] rounded-full bg-white",
              checked ? "opacity-100" : "opacity-0",
            )}
          />
        )}
      </span>

      <input
        type={shape === "square" ? "checkbox" : "radio"}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />

      {children && <span className="leading-snug">{children}</span>}
    </label>
  );
}
