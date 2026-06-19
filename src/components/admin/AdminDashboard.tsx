"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PENDING_EVENTS, type PendingEvent } from "@/lib/data/admin";
import {
  AdminSidebar,
  AdminMobileNav,
  NAV,
  type Tab,
} from "@/components/admin/AdminSidebar";
import { OverviewTab } from "@/components/admin/tabs/OverviewTab";
import { PendingTab } from "@/components/admin/tabs/PendingTab";
import { PublishedTab } from "@/components/admin/tabs/PublishedTab";
import { SubscribersTab } from "@/components/admin/tabs/SubscribersTab";
import { SystemTab } from "@/components/admin/tabs/SystemTab";

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const [pending, setPending] = useState<PendingEvent[]>(PENDING_EVENTS);

  const title = NAV.find((n) => n.key === tab)!.label;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        tab={tab}
        onTabChange={setTab}
        pendingCount={pending.length}
      />

      <div className="flex min-w-0 flex-1 flex-col pb-[72px] md:pb-0">
        <header className="sticky top-0 z-20 flex h-[62px] items-center justify-between border-b border-gray-200 bg-white px-[22px]">
          <div className="text-[15px] font-bold text-gray-900">{title}</div>

          <div className="flex items-center gap-3.5">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 text-[13px] font-semibold text-gray-700 hover:text-brand sm:inline-flex"
            >
              <ExternalLink className="h-[15px] w-[15px]" aria-hidden /> Voir le
              site
            </Link>

            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-brand text-[13px] font-bold text-white">
              AD
            </div>
          </div>
        </header>

        <main className="p-[22px]">
          {tab === "overview" && <OverviewTab pendingCount={pending.length} />}
          {tab === "pending" && (
            <PendingTab pending={pending} onChange={setPending} />
          )}
          {tab === "published" && <PublishedTab />}
          {tab === "subs" && <SubscribersTab />}
          {tab === "system" && <SystemTab />}
        </main>
      </div>

      <AdminMobileNav
        tab={tab}
        onTabChange={setTab}
        pendingCount={pending.length}
      />
    </div>
  );
}
