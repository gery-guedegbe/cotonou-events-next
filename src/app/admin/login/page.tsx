"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useAdminAuth } from "@/components/admin/AdminAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FieldLabel } from "@/components/ui/Field";

export default function AdminLoginPage() {
  const router = useRouter();
  const { authed, ready, login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && authed) router.replace("/admin");
  }, [ready, authed, router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      router.replace("/admin");
    } else {
      setError(
        "Identifiants incorrects. Renseignez un email et un mot de passe.",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-5">
      <div className="w-full max-w-[420px] rounded-[18px] border border-gray-200 bg-white px-8 py-9 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <div className="text-center text-xl font-extrabold tracking-[-0.03em]">
          cotonou<span className="text-brand">.events</span>
        </div>

        <h1 className="mt-[22px] text-center text-xl font-bold text-gray-900">
          Accès administrateur
        </h1>

        <p className="mb-6 mt-1 text-center text-[13.5px] text-gray-500">
          Connectez-vous pour gérer la plateforme.
        </p>

        <form onSubmit={submit} className="flex flex-col gap-3.5">
          <div>
            <FieldLabel htmlFor="email">Email</FieldLabel>

            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@cotonou.events"
            />
          </div>

          <div>
            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>

            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              error={error}
            />
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-[13px] text-red-500">
              <AlertCircle className="h-[15px] w-[15px]" aria-hidden /> {error}
            </div>
          )}

          <Button type="submit" size="lg">
            Se connecter
          </Button>
        </form>

        <div className="mt-[18px] text-center">
          <Link href="/" className="text-[13px] text-gray-500 hover:text-brand">
            ← Retour au site
          </Link>
        </div>

        <div className="mt-3.5 text-center text-xs text-gray-400">
          Démo : entrez n&apos;importe quel email et un mot de passe.
        </div>
      </div>
    </div>
  );
}
