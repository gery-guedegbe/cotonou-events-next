import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combine conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
