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

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [allEvents, pending, recentSubmissions, { subscribers, trend }] = await Promise.all([
    getAllAdminEvents(),
    getAdminPendingEvents(),
    getRecentSubmissions(),
    getAdminSubscribersData(),
  ]);

  const published = allEvents.filter((e) => e.statut === "publie");
  // isUpcomingWeekend borne déjà la fenêtre au week-end qui arrive, donc plus
  // besoin de comparer à la date du jour séparément.
  const weekendCount = published.filter((e) => isUpcomingWeekend(e.date)).length;
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
