import { HeroSection } from "@/components/sections/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { EventsPreviewSection } from "@/components/sections/EventsPreviewSection";
import { WhatsAppPreviewSection } from "@/components/sections/WhatsAppPreviewSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { OrganizersSection } from "@/components/sections/OrganizersSection";
import { getPublishedEvents } from "@/lib/supabase/events";

// ISR : la page affiche désormais les vrais événements, revalidée toutes les heures.
export const revalidate = 3600;

export default async function HomePage() {
  const events = await getPublishedEvents();
  return (
    <>
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <EventsPreviewSection events={events} />
      <WhatsAppPreviewSection />
      <CtaSection />
      <OrganizersSection />
    </>
  );
}
