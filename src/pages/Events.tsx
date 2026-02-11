import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Heart, Briefcase, Handshake, Loader2 } from "lucide-react";
import { RotaryWheelIcon } from "@/components/icons/RotaryWheelIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/events/EventCard";
import { FlagshipAccordion } from "@/components/events/FlagshipAccordion";

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
  parent_event_id: string | null;
}

const categoryConfig: Record<EventCategory, { label: string; icon: React.ComponentType<any>; color: string }> = {
  flagship: { label: "Flagship", icon: Crown, color: "bg-primary" },
  international: { label: "International", icon: RotaryWheelIcon, color: "bg-blue-500" },
  community: { label: "Community", icon: Heart, color: "bg-rose-500" },
  vocational: { label: "Vocational", icon: Briefcase, color: "bg-amber-500" },
  club: { label: "Club Service", icon: Handshake, color: "bg-emerald-500" },
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

  // Group flagship events by parent
  const { flagshipGroups, regularEvents } = useMemo(() => {
    const filteredByStatus = activeStatus === "all" 
      ? events 
      : events.filter(e => e.status === activeStatus);

    // Get flagship parent events (no parent_event_id and category is flagship)
    const flagshipParents = filteredByStatus.filter(
      e => e.category === "flagship" && !e.parent_event_id
    );

    // Get flagship children
    const flagshipChildren = filteredByStatus.filter(
      e => e.category === "flagship" && e.parent_event_id
    );

    // Build groups
    const groups = flagshipParents.map(parent => ({
      parent,
      children: flagshipChildren.filter(child => child.parent_event_id === parent.id)
    })).filter(group => group.children.length > 0);

    // Get events that have been grouped as children
    const groupedChildIds = new Set(groups.flatMap(g => g.children.map(c => c.id)));

    // Regular events: non-flagship OR standalone flagship (no children and not a child)
    const regular = filteredByStatus.filter(e => {
      if (activeCategory !== "all" && activeCategory !== "flagship" && e.category !== activeCategory) {
        return false;
      }
      if (activeCategory === "flagship") {
        // For flagship filter, show ungrouped flagship events
        if (e.category !== "flagship") return false;
        const isParentWithChildren = groups.some(g => g.parent.id === e.id);
        const isChild = groupedChildIds.has(e.id);
        return !isParentWithChildren && !isChild;
      }
      if (activeCategory === "all") {
        // Skip flagships that are grouped
        if (e.category === "flagship") {
          const isParentWithChildren = groups.some(g => g.parent.id === e.id);
          const isChild = groupedChildIds.has(e.id);
          if (isParentWithChildren || isChild) return false;
        }
        return true;
      }
      return e.category === activeCategory;
    });

    return {
      flagshipGroups: (activeCategory === "all" || activeCategory === "flagship") ? groups : [],
      regularEvents: regular
    };
  }, [events, activeCategory, activeStatus]);

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
                  { key: "ongoing", label: "Currently Active" },
                  { key: "upcoming", label: "Upcoming" },
                  { key: "past", label: "Completed" },
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

            {/* Events Content */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-12">
                {/* Flagship Accordion Groups */}
                {flagshipGroups.length > 0 && (
                  <FlagshipAccordion groups={flagshipGroups} />
                )}

                {/* Regular Events Grid */}
                {regularEvents.length > 0 && (
                  <div>
                    {flagshipGroups.length > 0 && (
                      <h3 className="font-display text-xl font-bold mb-6">
                        {activeCategory === "flagship" ? "Standalone Events" : "Other Events"}
                      </h3>
                    )}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {regularEvents.map((event, index) => (
                        <EventCard key={event.id} event={event} index={index} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isLoading && flagshipGroups.length === 0 && regularEvents.length === 0 && (
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
