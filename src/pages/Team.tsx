import { Navbar } from "@/components/Navbar";
import { TeamSection } from "@/components/TeamSection";
import { Footer } from "@/components/Footer";

const Team = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <TeamSection />
      </div>
      <Footer />
    </main>
  );
};

export default Team;
