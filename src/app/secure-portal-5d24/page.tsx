import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getAllAdminEvents,
  getAdminPendingEvents,
  getRecentSubmissions,
  getAdminSubscribersData,
} from "@/lib/supabase/admin";
import { isUpcomingWeekend } from "@/lib/utils/format-date";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ADMIN_BASE_PATH, ADMIN_LOGIN_PATH } from "@/lib/constants/admin-path";

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(ADMIN_LOGIN_PATH);

  const [allEvents, pending, recentSubmissions, { subscribers, trend }] =
    await Promise.all([
      getAllAdminEvents(),
      getAdminPendingEvents(),
      getRecentSubmissions(),
      getAdminSubscribersData(),
    ]);

  const published = allEvents.filter((e) => e.statut === "publie");
  const weekendCount = published.filter((e) =>
    isUpcomingWeekend(e.date),
  ).length;
  const activeSubscribers = subscribers.filter((s) => s.active).length;

  return (
    <AdminDashboard
      userEmail={user.email ?? ""}
      allEvents={allEvents}
      pendingEvents={pending}
      recentSubmissions={recentSubmissions}
      subscribers={subscribers}
      subscriberTrend={trend}
      overview={{
        publishedCount: published.length,
        pendingCount: pending.length,
        activeSubscribers,
        weekendCount,
      }}
    />
  );
}
