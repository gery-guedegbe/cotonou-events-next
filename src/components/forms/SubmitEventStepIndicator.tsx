import { cn } from "@/lib/utils/cn";

const STEP_NAMES = ["Informations", "Lieu & date", "Organisateur"];

export function SubmitEventStepIndicator({ step }: { step: number }) {
  return (
    <div className="mb-7 flex items-center gap-2">
      {STEP_NAMES.map((name, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        return (
          <div key={name} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-[30px] w-[30px] items-center justify-center rounded-full border-[1.5px] text-sm font-bold",
                  active && "border-brand bg-brand text-white",
                  done && "border-brand-light bg-brand-light text-brand",
                  !active && !done && "border-gray-200 bg-white text-gray-500",
                )}
              >
                {done ? "✓" : n}
              </div>

              <span className={cn("text-sm font-semibold", active || done ? "text-gray-900" : "text-gray-500")}>
                {name}
              </span>
            </div>
            {i < 2 && <div className="hidden h-px flex-1 bg-gray-200 sm:block sm:w-8" />}
          </div>
        );
      })}
    </div>
  );
}
