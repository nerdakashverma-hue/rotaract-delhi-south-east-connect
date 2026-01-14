import { Linkedin, Instagram, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  email: string | null;
  display_order: number;
}

export function TeamSection() {
  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as TeamMember[];
    },
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter((n) => !n.includes("Rtr.") && !n.includes("Rtn.") && !n.includes("IPP"))
      .map((n) => n[0])
      .join("")
      .slice(0, 2);
  };

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

        {/* Loading State */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-3xl p-6 text-center animate-pulse">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted" />
                <div className="h-6 bg-muted rounded w-3/4 mx-auto mb-2" />
                <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-4" />
                <div className="flex justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="w-10 h-10 rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Team Grid */}
        {!isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="glass-card rounded-3xl p-6 text-center hover-lift group"
              >
                {/* Avatar */}
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full gradient-bg opacity-20 blur-lg group-hover:opacity-40 transition-opacity" />
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover relative z-10 border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center relative z-10 border-2 border-primary/20">
                      <span className="text-primary font-bold text-lg">
                        {getInitials(member.name)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className="font-display text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-4">{member.role}</p>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-3">
                  <a
                    href={member.linkedin_url || "#"}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={member.instagram_url || "#"}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={member.email ? `mailto:${member.email}` : "#"}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
