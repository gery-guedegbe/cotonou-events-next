import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { ToastProvider } from "@/components/ui/Toast";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
      <CookieBanner />
    </ToastProvider>
  );
}
