import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/Icon";

export function StatsCard({
  label,
  value,
  icon,
  tone = "green",
}: {
  label: string;
  value: string;
  icon: string;
  tone?: "green" | "amber";
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-[18px]">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-gray-500">{label}</span>

        <div
          className={cn(
            "flex h-[34px] w-[34px] items-center justify-center rounded-[9px]",
            tone === "green" ? "bg-brand-light" : "bg-amber-100",
          )}
        >
          <Icon
            name={icon}
            className={cn(
              "h-[18px] w-[18px]",
              tone === "green" ? "text-brand" : "text-amber-600",
            )}
            aria-hidden
          />
        </div>
      </div>

      <div className="mt-2.5 text-[28px] font-extrabold tracking-[-0.02em] text-gray-900">
        {value}
      </div>
    </div>
  );
}
