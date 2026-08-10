import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import { MotionProvider } from "@/components/layout/MotionProvider";

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
