import { useState } from "react";
import { UserPlus, Send, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function MembershipSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase.from("membership_applications").insert({
        full_name: formData.get("full_name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        date_of_birth: formData.get("date_of_birth") as string || null,
        occupation: formData.get("occupation") as string || null,
        organization: formData.get("organization") as string || null,
        address: formData.get("address") as string || null,
        why_join: formData.get("why_join") as string || null,
        skills: formData.get("skills") as string || null,
        availability: formData.get("availability") as string || null,
        referral_source: formData.get("referral_source") as string || null,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Application Submitted! 🎉",
        description: "Welcome to the RAC DSE family! We'll reach out soon.",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Oops! Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="membership" className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mx-auto mb-8 animate-scale-in">
              <CheckCircle className="w-12 h-12 text-primary-foreground" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Welcome to the <span className="gradient-text">Family!</span> 🎉
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Your application has been received. Our team will review it and reach out to you within 48 hours. Get ready for an amazing journey!
            </p>
            <Button variant="hero" size="lg" onClick={() => setIsSubmitted(false)}>
              Submit Another Application
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="membership" className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-secondary/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            <UserPlus className="w-4 h-4 inline mr-2" />
            Join Us
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Become a <span className="gradient-text">Rotaractor</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to join our family of changemakers? Fill out the form below and start your journey with RAC DSE!
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Benefits */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-display text-2xl font-bold mb-6">
              What You'll <span className="gradient-text">Get</span>
            </h3>
            
            {[
              { title: "Leadership Skills", desc: "Lead projects and develop real-world management skills" },
              { title: "Global Network", desc: "Connect with Rotaractors across 180+ countries" },
              { title: "Personal Growth", desc: "Transform from shy to confident through experiences" },
              { title: "Lifelong Friends", desc: "Build bonds that go way beyond club meetings" },
              { title: "Resume Boost", desc: "Add meaningful experiences that stand out" },
              { title: "Make Impact", desc: "Create tangible change in communities" },
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name *</label>
                  <Input 
                    name="full_name"
                    placeholder="Your full name" 
                    required 
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address *</label>
                  <Input 
                    name="email"
                    type="email" 
                    placeholder="you@example.com" 
                    required 
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number *</label>
                  <Input 
                    name="phone"
                    type="tel" 
                    placeholder="+91 98765 43210" 
                    required 
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Date of Birth</label>
                  <Input 
                    name="date_of_birth"
                    type="date" 
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Occupation</label>
                  <Input 
                    name="occupation"
                    placeholder="Student / Professional / etc." 
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Organization / College</label>
                  <Input 
                    name="organization"
                    placeholder="Where you work or study" 
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Address</label>
                <Input 
                  name="address"
                  placeholder="Your city / area" 
                  className="h-12 rounded-xl"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Why do you want to join RAC DSE?</label>
                <Textarea 
                  name="why_join"
                  placeholder="Tell us what excites you about Rotaract and what you hope to achieve..."
                  className="min-h-[100px] rounded-xl resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">What skills can you bring to the club?</label>
                <Textarea 
                  name="skills"
                  placeholder="E.g., event management, design, public speaking, social media..."
                  className="min-h-[80px] rounded-xl resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Availability</label>
                  <Input 
                    name="availability"
                    placeholder="Weekends / Weekdays / Flexible" 
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">How did you hear about us?</label>
                  <Input 
                    name="referral_source"
                    placeholder="Social media / Friend / Event" 
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                size="xl" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By submitting, you agree to be contacted by our team regarding your membership.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
