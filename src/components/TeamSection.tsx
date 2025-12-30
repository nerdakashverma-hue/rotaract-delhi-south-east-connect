import { Linkedin, Instagram, Mail } from "lucide-react";

const teamMembers = [
  {
    name: "President",
    role: "Club President",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Vice President",
    role: "Vice President",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Secretary",
    role: "Club Secretary",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Treasurer",
    role: "Club Treasurer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Director - Service",
    role: "Service Projects Lead",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Director - PR",
    role: "Public Relations",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
  },
];

export function TeamSection() {
  return (
    <section id="team" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Our Team
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Meet the <span className="gradient-text">Changemakers</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The passionate individuals driving our mission forward, one project at a time.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="glass-card rounded-3xl p-6 text-center hover-lift group"
            >
              {/* Avatar */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full gradient-bg opacity-20 blur-lg group-hover:opacity-40 transition-opacity" />
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover relative z-10 border-4 border-card"
                />
              </div>

              {/* Info */}
              <h3 className="font-display text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-primary font-medium mb-4">{member.role}</p>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
