"use client";

import { Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder = "Rechercher un événement, un lieu...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"
        aria-hidden
      />

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Rechercher"
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border-[1.5px] border-gray-200 pl-11 pr-4 text-base text-gray-900 outline-none transition-shadow placeholder:text-gray-500 focus:border-brand focus:shadow-[0_0_0_3px_rgba(22,163,74,0.12)]"
      />
    </div>
  );
}
