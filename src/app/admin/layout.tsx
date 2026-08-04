import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import { MotionProvider } from "@/components/layout/MotionProvider";

// Chargée ici plutôt que dans le layout racine : seuls la liste des abonnés
// et le journal système s'en servent, et le site public n'a pas à payer le
// téléchargement d'une police qu'il n'affiche jamais.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={mono.variable}>
      <MotionProvider>
        <ToastProvider>{children}</ToastProvider>
      </MotionProvider>
    </div>
  );
}
