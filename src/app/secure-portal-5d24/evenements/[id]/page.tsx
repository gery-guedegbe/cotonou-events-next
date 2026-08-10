import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Phone, Mail, Facebook } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminEventById } from "@/lib/supabase/admin";
import {
  EventDetailView,
  EventHeroImage,
} from "@/components/events/EventDetailView";
import { EventModerationActions } from "@/components/admin/EventModerationActions";
import { cn } from "@/lib/utils/cn";
import { ADMIN_BASE_PATH, ADMIN_LOGIN_PATH } from "@/lib/constants/admin-path";

const STATUT_BADGE: Record<string, string> = {
  en_attente: "bg-amber-100 text-amber-800",
  publie: "bg-brand-light text-brand-fg",
  rejete: "bg-red-100 text-red-800",
};

const STATUT_LABEL: Record<string, string> = {
  en_attente: "En attente",
  publie: "Publié",
  rejete: "Rejeté",
};

export default async function AdminEventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(ADMIN_LOGIN_PATH);

  const event = await getAdminEventById(params.id);
  if (!event) notFound();

  return (
    <div className="mx-auto max-w-[900px] p-6">
      <Link
        href={ADMIN_BASE_PATH}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> Retour au dashboard
      </Link>

      <div className="mt-4">
        <EventHeroImage event={event} />
      </div>

      <div className="mt-7">
        <span
          className={cn(
            "rounded-pill px-2.5 py-1 text-2xs font-bold uppercase tracking-label",
            STATUT_BADGE[event.statut],
          )}
        >
          {STATUT_LABEL[event.statut]}
        </span>

        <div className="mt-5">
          <EventDetailView event={event} />
        </div>

        <h2 className="mb-3 mt-8 text-lg font-bold text-gray-900">
          Contact organisateur
        </h2>

        <div className="flex flex-col gap-2.5 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-700">
          <div className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 flex-none text-brand" aria-hidden />
            {event.contactPhone}
          </div>

          {event.contactEmail && (
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 flex-none text-brand" aria-hidden />
              {event.contactEmail}
            </div>
          )}

          {event.contactFb && (
            <div className="flex items-center gap-2.5">
              <Facebook className="h-4 w-4 flex-none text-brand" aria-hidden />
              <a
                href={event.contactFb}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand"
              >
                {event.contactFb}
              </a>
            </div>
          )}
        </div>

        <div className="mt-7">
          <EventModerationActions id={event.id} statut={event.statut} />
        </div>
      </div>
    </div>
  );
}
