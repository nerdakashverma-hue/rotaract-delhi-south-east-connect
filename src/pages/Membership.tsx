import { Navbar } from "@/components/Navbar";
import { MembershipSection } from "@/components/MembershipSection";
import { Footer } from "@/components/Footer";

const Membership = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <MembershipSection />
      </div>
      <Footer />
    </main>
  );
};

export default Membership;
