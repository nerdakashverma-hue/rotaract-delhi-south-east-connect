import { ArrowRight, Heart, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroVideo from "@/assets/hero-video.mp4";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-primary/20 blur-xl animate-float z-10" />
      <div className="absolute bottom-1/3 right-10 w-32 h-32 rounded-full bg-secondary/20 blur-xl animate-float animation-delay-200 z-10" />

      <div className="container mx-auto px-4 pt-20 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in-up backdrop-blur-sm">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Rotaract District 3011</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up animation-delay-100">
            <span className="block">Rotaract Club of</span>
            <span className="gradient-text">Delhi South East</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-200">
            Where passion meets purpose, and youth meets action! We're a family of changemakers creating lasting impact through service, leadership, and friendship.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up animation-delay-300">
            <Button variant="hero" size="xl" asChild>
              <Link to="/membership">
                <Heart className="w-5 h-5" />
                Join Our Family
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/events">
                <Users className="w-5 h-5" />
                Explore Events
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 animate-fade-in-up animation-delay-400">
            {[
              { number: "450+", label: "Saplings Planted" },
              { number: "50+", label: "Blood Units Collected" },
              { number: "4000+", label: "Pads Donated" },
              { number: "800+", label: "Lives Impacted" },
            ].map((stat, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 hover-lift"
              >
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
