import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { WhyChooseSection } from "@/components/WhyChooseSection";
import { TeamSection } from "@/components/TeamSection";
import { EventsSection } from "@/components/EventsSection";
import { FAQSection } from "@/components/FAQSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <WhyChooseSection />
      <TeamSection />
      <EventsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
