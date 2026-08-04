"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={!!error}
      className={cn(
        "h-11 w-full rounded-lg border-[1.5px] border-gray-200 px-3.5 text-base text-gray-900 outline-none transition-shadow placeholder:text-gray-500",
        "focus:border-brand focus:shadow-[0_0_0_3px_rgba(22,163,74,0.12)]",
        error &&
          "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]",
        className,
      )}
      {...props}
    />
  );
});
