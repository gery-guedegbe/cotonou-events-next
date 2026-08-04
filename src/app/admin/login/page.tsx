"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FieldLabel } from "@/components/ui/Field";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    router.replace("/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-5">
      <div className="w-full max-w-[420px] rounded-[18px] border border-gray-200 bg-white px-8 py-9 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <div className="text-center text-xl font-extrabold tracking-display">
          cotonou<span className="text-brand">.events</span>
        </div>

        <h1 className="mt-6 text-center text-xl font-bold text-gray-900">
          Accès administrateur
        </h1>

        <p className="mb-6 mt-1 text-center text-sm text-gray-500">
          Connectez-vous pour gérer la plateforme.
        </p>

        <form onSubmit={submit} className="flex flex-col gap-3.5">
          <div>
            <FieldLabel htmlFor="email">Email</FieldLabel>

            <Input
              id="email"
              type="email"
              autoComplete="username"
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              error={error}
            />
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-sm text-red-500">
              <AlertCircle className="h-[15px] w-[15px]" aria-hidden /> {error}
            </div>
          )}

          <Button type="submit" size="lg" loading={loading}>
            Se connecter
          </Button>
        </form>

        <div className="mt-5 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-brand">
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}
