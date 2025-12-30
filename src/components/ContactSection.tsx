import { useState } from "react";
import { Send, Building, Calendar, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type FormType = "sponsorship" | "event";

export function ContactSection() {
  const [activeForm, setActiveForm] = useState<FormType>("sponsorship");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Message Sent! 🎉",
      description: "We'll get back to you within 24-48 hours.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Get In Touch
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you want to sponsor our initiatives or need us to organize an event for you, we're here to collaborate!
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card rounded-3xl p-8">
              <h3 className="font-display text-xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Email Us</p>
                    <a href="mailto:racdse@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                      racdse@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Call Us</p>
                    <a href="tel:+919876543210" className="text-muted-foreground hover:text-primary transition-colors">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Location</p>
                    <p className="text-muted-foreground">
                      South East Delhi, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-card rounded-3xl p-8">
              <h3 className="font-display text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {["Instagram", "LinkedIn", "Facebook", "Twitter"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:gradient-bg hover:text-primary-foreground transition-all"
                  >
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-3xl p-8">
              {/* Form Toggle */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={() => setActiveForm("sponsorship")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-all",
                    activeForm === "sponsorship"
                      ? "gradient-bg text-primary-foreground shadow-lg"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  <Building className="w-5 h-5" />
                  Sponsor Us
                </button>
                <button
                  onClick={() => setActiveForm("event")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-all",
                    activeForm === "event"
                      ? "gradient-bg text-primary-foreground shadow-lg"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  <Calendar className="w-5 h-5" />
                  Request Event
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Name *</label>
                    <Input 
                      placeholder="John Doe" 
                      required 
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Address *</label>
                    <Input 
                      type="email" 
                      placeholder="john@example.com" 
                      required 
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone Number</label>
                    <Input 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {activeForm === "sponsorship" ? "Organization" : "Event Type"} *
                    </label>
                    <Input 
                      placeholder={activeForm === "sponsorship" ? "Company Name" : "e.g., Blood Donation Camp"} 
                      required 
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {activeForm === "sponsorship" ? "How would you like to support us?" : "Tell us about your event requirements"} *
                  </label>
                  <Textarea 
                    placeholder={activeForm === "sponsorship" 
                      ? "Describe your sponsorship interests, budget range, and what you hope to achieve..." 
                      : "Describe your event requirements, expected attendees, preferred date/location..."
                    }
                    required 
                    className="min-h-[150px] rounded-xl resize-none"
                  />
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
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
