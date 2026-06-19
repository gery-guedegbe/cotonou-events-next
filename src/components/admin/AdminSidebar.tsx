"use client";

import {
  LayoutDashboard,
  Clock,
  CalendarCheck,
  Users,
  Activity,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAdminAuth } from "@/components/admin/AdminAuth";

export type Tab = "overview" | "pending" | "published" | "subs" | "system";

export const NAV: {
  key: Tab;
  label: string;
  short: string;
  Icon: typeof LayoutDashboard;
}[] = [
  {
    key: "overview",
    label: "Vue d'ensemble",
    short: "Accueil",
    Icon: LayoutDashboard,
  },
  { key: "pending", label: "À valider", short: "Valider", Icon: Clock },
  {
    key: "published",
    label: "Événements publiés",
    short: "Publiés",
    Icon: CalendarCheck,
  },
  { key: "subs", label: "Abonnés WhatsApp", short: "Abonnés", Icon: Users },
  { key: "system", label: "Système", short: "Système", Icon: Activity },
];

interface NavProps {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  pendingCount: number;
}

export function AdminSidebar({ tab, onTabChange, pendingCount }: NavProps) {
  const { logout } = useAdminAuth();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 flex-none flex-col border-r border-gray-200 bg-white p-5 md:flex">
      <div className="px-2.5 pb-[18px] pt-1.5 text-lg font-extrabold tracking-[-0.03em]">
        cotonou<span className="text-brand">.events</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map((n) => (
          <button
            key={n.key}
            onClick={() => onTabChange(n.key)}
            className={cn(
              "flex items-center gap-[11px] rounded-[10px] px-3 py-2.5 text-left text-sm font-semibold transition-colors",
              tab === n.key
                ? "bg-[#F0FDF4] text-brand"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            <n.Icon className="h-[18px] w-[18px]" aria-hidden />

            <span className="flex-1">{n.label}</span>

            {n.key === "pending" && pendingCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-pill bg-red-500 px-1.5 text-[11px] font-bold text-white">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <button
        onClick={logout}
        className="mt-auto flex items-center gap-[11px] rounded-[10px] px-3 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100"
      >
        <LogOut className="h-[18px] w-[18px]" aria-hidden /> Déconnexion
      </button>
    </aside>
  );
}

export function AdminMobileNav({ tab, onTabChange, pendingCount }: NavProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-gray-200 bg-white px-1 py-1.5 md:hidden">
      <div className="flex justify-around">
        {NAV.map((n) => (
          <button
            key={n.key}
            onClick={() => onTabChange(n.key)}
            className={cn(
              "relative flex flex-1 flex-col items-center gap-0.5 px-0.5 py-1.5",
              tab === n.key ? "text-brand" : "text-gray-400",
            )}
          >
            <n.Icon className="h-5 w-5" aria-hidden />

            <span className="text-[9.5px] font-semibold">{n.short}</span>

            {n.key === "pending" && pendingCount > 0 && (
              <span className="absolute right-[18%] top-0.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-pill bg-red-500 px-1 text-[9px] font-bold text-white">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
