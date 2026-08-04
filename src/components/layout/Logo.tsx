import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function Logo({
  className,
  light,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "text-xl font-extrabold tracking-display",
        light ? "text-white" : "text-gray-900",
        className,
      )}
    >
      cotonou<span className="text-brand">.events</span>
    </Link>
  );
}
