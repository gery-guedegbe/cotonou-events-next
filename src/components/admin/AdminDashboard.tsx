"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Subscriber } from "@/lib/types/subscriber.types";
import type { AdminPendingEvent, AdminEventListItem, RecentSubmission } from "@/lib/supabase/admin";
import {
  AdminSidebar,
  AdminMobileNav,
  NAV,
  type Tab,
} from "@/components/admin/AdminSidebar";
import { OverviewTab } from "@/components/admin/tabs/OverviewTab";
import { PendingTab } from "@/components/admin/tabs/PendingTab";
import { AllEventsTab } from "@/components/admin/tabs/AllEventsTab";
import { SubscribersTab } from "@/components/admin/tabs/SubscribersTab";
import { SystemTab } from "@/components/admin/tabs/SystemTab";

interface AdminDashboardProps {
  userEmail: string;
  allEvents: AdminEventListItem[];
  pendingEvents: AdminPendingEvent[];
  recentSubmissions: RecentSubmission[];
  subscribers: Subscriber[];
  subscriberTrend: number[];
  overview: {
    publishedCount: number;
    pendingCount: number;
    activeSubscribers: number;
    weekendCount: number;
  };
}

export function AdminDashboard({
  userEmail,
  allEvents,
  pendingEvents,
  recentSubmissions,
  subscribers,
  subscriberTrend,
  overview,
}: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>("overview");
  const [pending, setPending] = useState<AdminPendingEvent[]>(pendingEvents);

  const title = NAV.find((n) => n.key === tab)!.label;
  const initials = userEmail.slice(0, 2).toUpperCase() || "AD";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        tab={tab}
        onTabChange={setTab}
        pendingCount={pending.length}
      />

      <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
        <header className="sticky top-0 z-20 flex h-[62px] items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="text-base font-bold text-gray-900">{title}</div>

          <div className="flex items-center gap-3.5">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-brand sm:inline-flex"
            >
              <ExternalLink className="h-[15px] w-[15px]" aria-hidden /> Voir le
              site
            </Link>

            <div
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-brand text-sm font-bold text-white"
              title={userEmail}
            >
              {initials}
            </div>
          </div>
        </header>

        <main className="p-6">
          {tab === "overview" && (
            <OverviewTab
              overview={overview}
              recentSubmissions={recentSubmissions}
              subscriberTrend={subscriberTrend}
            />
          )}
          {tab === "pending" && (
            <PendingTab pending={pending} onChange={setPending} />
          )}
          {tab === "published" && <AllEventsTab events={allEvents} />}
          {tab === "subs" && <SubscribersTab subscribers={subscribers} />}
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
