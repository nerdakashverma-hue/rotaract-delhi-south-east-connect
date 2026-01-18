import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type EventStatus = "ongoing" | "upcoming" | "past";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  attendees: number;
  status: EventStatus;
  image_url: string | null;
}

const statusConfig = {
  ongoing: {
    label: "Currently Active",
    color: "bg-green-500",
    bgColor: "bg-green-500/10",
    textColor: "text-green-600",
  },
  upcoming: {
    label: "Coming Soon",
    color: "bg-secondary",
    bgColor: "bg-secondary/10",
    textColor: "text-secondary",
  },
  past: {
    label: "Completed",
    color: "bg-muted-foreground",
    bgColor: "bg-muted",
    textColor: "text-muted-foreground",
  },
};

export function EventsSection() {
  const [activeFilter, setActiveFilter] = useState<EventStatus | "all">("all");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
  });

  const filteredEvents = activeFilter === "all" 
    ? events 
    : events.filter(e => e.status === activeFilter);

  return (
    <section id="events" className="py-20 md:py-32 bg-muted/30 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Our Events
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Making <span className="gradient-text">Impact</span> Together
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From plantation drives to blood donation camps, explore our projects that create real change.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {[
            { key: "all", label: "All Events" },
            { key: "ongoing", label: "🔥 Currently Active" },
            { key: "upcoming", label: "📅 Upcoming" },
            { key: "past", label: "✅ Completed" },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as EventStatus | "all")}
              className={cn(
                "px-6 py-3 rounded-full font-medium transition-all",
                activeFilter === filter.key
                  ? "gradient-bg text-primary-foreground shadow-lg"
                  : "bg-card hover:bg-muted"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="glass-card rounded-3xl overflow-hidden hover-lift group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                      statusConfig[event.status].bgColor,
                      statusConfig[event.status].textColor
                    )}>
                      <span className={cn("w-2 h-2 rounded-full", statusConfig[event.status].color)} />
                      {statusConfig[event.status].label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      {event.date}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        {event.location}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4 text-primary" />
                      {event.attendees}+ Participants
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant={event.status === "ongoing" ? "hero" : "outline"} 
                    className="w-full"
                  >
                    {event.status === "ongoing" ? "Join Now" : event.status === "upcoming" ? "Register Interest" : "View Details"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
