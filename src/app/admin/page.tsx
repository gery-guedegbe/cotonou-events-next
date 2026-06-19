"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const router = useRouter();
  const { authed, ready } = useAdminAuth();

  useEffect(() => {
    if (ready && !authed) router.replace("/admin/login");
  }, [ready, authed, router]);

  if (!ready || !authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-400">
        Chargement…
      </div>
    );
  }

  return <AdminDashboard />;
}
