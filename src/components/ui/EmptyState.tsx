import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Action de sortie. Un état vide sans porte de sortie est une impasse. */
  action?: React.ReactNode;
  className?: string;
}

/**
 * État vide unifié. Le motif existait déjà dupliqué dans le navigateur
 * d'événements et manquait totalement ailleurs, ce qui laissait des zones
 * blanches sans explication dès qu'un filtre ne renvoyait rien.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-gray-300 px-5 py-16 text-center",
        className,
      )}
    >
      <Icon
        className="mx-auto h-12 w-12 text-gray-500"
        strokeWidth={1.5}
        aria-hidden
      />

      <h3 className="mt-5 text-lg font-bold text-gray-900">{title}</h3>

      <p className="mx-auto mt-2 max-w-[420px] text-sm text-gray-600">
        {description}
      </p>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
