import { cn } from "@/lib/utils/cn";

export function Card({
  className,
  hover,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-card",
        hover && "transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-card-hover",
        className,
      )}
      {...props}
    />
  );
}
