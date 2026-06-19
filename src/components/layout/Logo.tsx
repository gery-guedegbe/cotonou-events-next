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
        "text-[19px] font-extrabold tracking-[-0.03em]",
        light ? "text-white" : "text-gray-900",
        className,
      )}
    >
      cotonou<span className="text-brand">.events</span>
    </Link>
  );
}
