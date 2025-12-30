import { useState } from "react";
import { Calendar, MapPin, Users, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EventStatus = "ongoing" | "upcoming" | "past";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  attendees: number;
  status: EventStatus;
  image: string;
}

const events: Event[] = [
  {
    id: 1,
    title: "Blood Donation Camp 2025",
    description: "Join us for our annual blood donation drive in collaboration with local hospitals. Every drop counts!",
    date: "January 15, 2025",
    location: "Community Center, South Delhi",
    attendees: 150,
    status: "ongoing",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Green Delhi Plantation Drive",
    description: "Help us plant 500+ saplings across South Delhi parks and communities.",
    date: "February 5, 2025",
    location: "Various Locations",
    attendees: 200,
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Menstrual Hygiene Awareness",
    description: "Distribution of sanitary pads and awareness sessions in underprivileged communities.",
    date: "March 8, 2025",
    location: "Various Schools",
    attendees: 300,
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Amulya - Old Age Home Visit",
    description: "Our heartwarming initiative to seek blessings and spread joy at local old age homes.",
    date: "December 10, 2024",
    location: "Sunrise Old Age Home",
    attendees: 50,
    status: "past",
    image: "https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Health Camp 2024",
    description: "Free health checkups and medical consultations for 800+ underprivileged individuals.",
    date: "November 20, 2024",
    location: "Community Hall, Saket",
    attendees: 800,
    status: "past",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
  },
];

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className="glass-card rounded-3xl overflow-hidden hover-lift group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    {event.location}
                  </div>
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
      </div>
    </section>
  );
}
