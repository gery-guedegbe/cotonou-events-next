import { cn } from "@/lib/utils/cn";

/** Libellé de champ de formulaire associé via htmlFor. */
export function FieldLabel({
  htmlFor,
  optional,
  children,
  className,
}: {
  htmlFor?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "mb-1.5 block text-sm font-semibold text-gray-700",
        className,
      )}
    >
      {children}
      {optional && (
        <span className="font-normal text-gray-500"> (optionnel)</span>
      )}
    </label>
  );
}

/** Message d'erreur inline sous un champ. */
export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-1.5 text-xs text-red-500">{children}</p>;
}
