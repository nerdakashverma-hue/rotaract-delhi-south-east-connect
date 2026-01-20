import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowRight, Camera, Crown, Globe, Heart, Briefcase, Handshake, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type EventStatus = "ongoing" | "upcoming" | "past";
type EventCategory = "flagship" | "international" | "community" | "vocational" | "club";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  attendees: number;
  status: string;
  category: string | null;
  image_url: string | null;
  gallery_slug: string | null;
}

const categoryConfig: Record<EventCategory, { label: string; icon: typeof Crown; color: string; bgColor: string; textColor: string }> = {
  flagship: {
    label: "Flagship",
    icon: Crown,
    color: "bg-primary",
    bgColor: "bg-primary/10",
    textColor: "text-primary",
  },
  international: {
    label: "International",
    icon: Globe,
    color: "bg-blue-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600",
  },
  community: {
    label: "Community",
    icon: Heart,
    color: "bg-rose-500",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-600",
  },
  vocational: {
    label: "Vocational",
    icon: Briefcase,
    color: "bg-amber-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600",
  },
  club: {
    label: "Club Service",
    icon: Handshake,
    color: "bg-emerald-500",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600",
  },
};

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

const Events = () => {
  const [activeCategory, setActiveCategory] = useState<EventCategory | "all">("all");
  const [activeStatus, setActiveStatus] = useState<EventStatus | "all">("all");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events-page"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
  });

  const filteredEvents = events.filter((e) => {
    const categoryMatch = activeCategory === "all" || e.category === activeCategory;
    const statusMatch = activeStatus === "all" || e.status === activeStatus;
    return categoryMatch && statusMatch;
  });

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <section className="py-20 md:py-32 bg-muted/30 relative">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                Our Events
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Making <span className="gradient-text">Impact</span> Together
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From plantation drives to blood donation camps, explore our projects that create real change.
              </p>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 text-center">Filter by Category</h3>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={cn(
                    "px-5 py-2.5 rounded-full font-medium transition-all text-sm flex items-center gap-2",
                    activeCategory === "all"
                      ? "gradient-bg text-primary-foreground shadow-lg"
                      : "bg-card hover:bg-muted border border-border"
                  )}
                >
                  All Categories
                </button>
                {(Object.keys(categoryConfig) as EventCategory[]).map((cat) => {
                  const config = categoryConfig[cat];
                  const Icon = config.icon;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "px-5 py-2.5 rounded-full font-medium transition-all text-sm flex items-center gap-2",
                        activeCategory === cat
                          ? `${config.color} text-white shadow-lg`
                          : "bg-card hover:bg-muted border border-border"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Filter */}
            <div className="mb-12">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 text-center">Filter by Status</h3>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  { key: "all", label: "All Events" },
                  { key: "ongoing", label: "🔥 Currently Active" },
                  { key: "upcoming", label: "📅 Upcoming" },
                  { key: "past", label: "✅ Completed" },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveStatus(filter.key as EventStatus | "all")}
                    className={cn(
                      "px-6 py-3 rounded-full font-medium transition-all",
                      activeStatus === filter.key
                        ? "gradient-bg text-primary-foreground shadow-lg"
                        : "bg-card hover:bg-muted"
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Events Grid */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, index) => {
                  const catConfig = categoryConfig[(event.category as EventCategory) || "community"];
                  const statConfig = statusConfig[(event.status as EventStatus) || "past"];
                  const CatIcon = catConfig?.icon || Heart;
                  
                  return (
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
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                            statConfig?.bgColor || "bg-muted",
                            statConfig?.textColor || "text-muted-foreground"
                          )}>
                            <span className={cn("w-2 h-2 rounded-full", statConfig?.color || "bg-muted-foreground")} />
                            {statConfig?.label || "Completed"}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                            catConfig?.bgColor || "bg-muted",
                            catConfig?.textColor || "text-muted-foreground"
                          )}>
                            <CatIcon className="w-3 h-3" />
                            {catConfig?.label || "Community"}
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

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button 
                            variant={event.status === "ongoing" ? "hero" : "outline"} 
                            className="flex-1"
                          >
                            {event.status === "ongoing" ? "Join Now" : event.status === "upcoming" ? "Register" : "Details"}
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                          {event.gallery_slug && (
                            <Button variant="outline" size="icon" asChild>
                              <Link to={`/gallery?event=${event.gallery_slug}`}>
                                <Camera className="w-4 h-4" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!isLoading && filteredEvents.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No events found matching your filters.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => { setActiveCategory("all"); setActiveStatus("all"); }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
};

export default Events;
