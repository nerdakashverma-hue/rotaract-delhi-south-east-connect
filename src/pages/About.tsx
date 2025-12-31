import { Navbar } from "@/components/Navbar";
import { AboutSection } from "@/components/AboutSection";
import { WhyChooseSection } from "@/components/WhyChooseSection";
import { Footer } from "@/components/Footer";

const About = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <AboutSection />
        <WhyChooseSection />
      </div>
      <Footer />
    </main>
  );
};

export default About;
