"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
  options: readonly string[];
  error?: string;
}

/** Select natif stylisé (chevron custom, état placeholder grisé). */
export function Select({
  placeholder,
  options,
  error,
  value,
  className,
  ...props
}: SelectProps) {
  const [touched, setTouched] = useState(false);
  const isPlaceholder = !value;
  return (
    <div className="relative">
      <select
        value={value}
        aria-invalid={!!error}
        onBlur={() => setTouched(true)}
        className={cn(
          "h-11 w-full appearance-none rounded-lg border-[1.5px] border-gray-200 bg-white px-3 pr-10 text-[15px] outline-none focus:border-brand",
          isPlaceholder ? "text-gray-400" : "text-gray-900",
          error && touched && "border-red-500",
          className,
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>

      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        aria-hidden
      />
    </div>
  );
}
