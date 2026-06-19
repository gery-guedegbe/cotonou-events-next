"use client";

import { cn } from "@/lib/utils/cn";

export function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-none rounded-pill px-4 py-2 text-[13.5px] font-semibold transition-colors",
        active
          ? "bg-brand text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
      )}
    >
      {label}
    </button>
  );
}
