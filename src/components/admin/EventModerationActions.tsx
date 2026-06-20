"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, EyeOff } from "lucide-react";
import { approveEvent, rejectEvent, unpublishEvent } from "@/lib/actions/admin-events";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import type { EventStatut } from "@/lib/supabase/admin";

type ActionResult = { ok: true } | { ok: false; error: string };

export function EventModerationActions({ id, statut }: { id: string; statut: EventStatut }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const run = async (action: () => Promise<ActionResult>, successTitle: string) => {
    setLoading(true);
    const result = await action();
    setLoading(false);

    if (!result.ok) {
      toast({ variant: "error", title: "Action impossible", description: result.error });
      return;
    }

    toast({ variant: "success", title: successTitle });
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex flex-wrap gap-2.5">
      {statut !== "publie" && (
        <Button loading={loading} onClick={() => run(() => approveEvent(id), "Événement publié")}>
          <Check className="h-4 w-4" aria-hidden /> Publier
        </Button>
      )}

      {statut === "en_attente" && (
        <Button
          variant="secondary"
          loading={loading}
          onClick={() => run(() => rejectEvent(id), "Événement rejeté")}
        >
          <X className="h-4 w-4" aria-hidden /> Rejeter
        </Button>
      )}

      {statut === "publie" && (
        <Button
          variant="secondary"
          loading={loading}
          onClick={() => run(() => unpublishEvent(id), "Événement dépublié")}
        >
          <EyeOff className="h-4 w-4" aria-hidden /> Dépublier
        </Button>
      )}
    </div>
  );
}
