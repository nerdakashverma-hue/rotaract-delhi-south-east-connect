import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowRight, Camera, Crown, Globe, Heart, Briefcase, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type EventStatus = "ongoing" | "upcoming" | "past";
type EventCategory = "flagship" | "international" | "community" | "vocational" | "club";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  attendees: number;
  status: EventStatus;
  category: EventCategory;
  image: string;
  gallerySlug?: string;
}

const events: Event[] = [
  // Flagship Events
  {
    id: 1,
    title: "Blood Donation Camp 2025",
    description: "Our annual flagship blood donation drive in collaboration with local hospitals. Every drop counts!",
    date: "January 15, 2025",
    location: "Community Center, South Delhi",
    attendees: 150,
    status: "ongoing",
    category: "flagship",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600&h=400&fit=crop",
    gallerySlug: "blood-donation-2025",
  },
  {
    id: 2,
    title: "Green Delhi Plantation Drive",
    description: "Our flagship environmental initiative - planting 500+ saplings across South Delhi parks.",
    date: "February 5, 2025",
    location: "Various Locations",
    attendees: 200,
    status: "upcoming",
    category: "flagship",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop",
    gallerySlug: "plantation-drive-2025",
  },
  // International Events
  {
    id: 3,
    title: "World Rotaract Week Celebration",
    description: "Celebrating Rotaract's global impact with clubs worldwide through collaborative service.",
    date: "March 13-19, 2025",
    location: "Multiple Locations",
    attendees: 500,
    status: "upcoming",
    category: "international",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
    gallerySlug: "world-rotaract-week",
  },
  {
    id: 4,
    title: "Global Youth Service Day",
    description: "Connecting with international Rotaract clubs for a day of unified community service.",
    date: "April 26, 2025",
    location: "Virtual + Local Projects",
    attendees: 300,
    status: "upcoming",
    category: "international",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop",
  },
  // Community Services
  {
    id: 5,
    title: "Menstrual Hygiene Awareness",
    description: "Distribution of sanitary pads and awareness sessions in underprivileged communities.",
    date: "March 8, 2025",
    location: "Various Schools",
    attendees: 300,
    status: "upcoming",
    category: "community",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
    gallerySlug: "menstrual-hygiene-2025",
  },
  {
    id: 6,
    title: "Amulya - Old Age Home Visit",
    description: "Our heartwarming initiative to seek blessings and spread joy at local old age homes.",
    date: "December 10, 2024",
    location: "Sunrise Old Age Home",
    attendees: 50,
    status: "past",
    category: "community",
    image: "https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=600&h=400&fit=crop",
    gallerySlug: "amulya-2024",
  },
  {
    id: 7,
    title: "Health Camp 2024",
    description: "Free health checkups and medical consultations for 800+ underprivileged individuals.",
    date: "November 20, 2024",
    location: "Community Hall, Saket",
    attendees: 800,
    status: "past",
    category: "community",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    gallerySlug: "health-camp-2024",
  },
  // Vocational Events
  {
    id: 8,
    title: "Career Guidance Workshop",
    description: "Helping students explore career paths with industry professionals and mentors.",
    date: "February 20, 2025",
    location: "Delhi University Campus",
    attendees: 150,
    status: "upcoming",
    category: "vocational",
    image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=600&h=400&fit=crop",
  },
  {
    id: 9,
    title: "Skill Development Camp",
    description: "Teaching employable skills like digital marketing, communication, and financial literacy.",
    date: "January 28, 2025",
    location: "RAC DSE Hub",
    attendees: 75,
    status: "ongoing",
    category: "vocational",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    gallerySlug: "skill-development-2025",
  },
  // Club Services
  {
    id: 10,
    title: "New Member Induction Ceremony",
    description: "Welcoming our newest Rotaractors to the RAC DSE family with a formal ceremony.",
    date: "January 10, 2025",
    location: "Club Headquarters",
    attendees: 40,
    status: "past",
    category: "club",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop",
    gallerySlug: "induction-2025",
  },
  {
    id: 11,
    title: "Annual Fellowship Night",
    description: "A night of celebration, recognition, and bonding with all RAC DSE members.",
    date: "March 25, 2025",
    location: "Grand Ballroom, Delhi",
    attendees: 100,
    status: "upcoming",
    category: "club",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&h=400&fit=crop",
  },
];

const categoryConfig = {
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
    label: "Community Services",
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
    label: "Club Services",
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => {
                const catConfig = categoryConfig[event.category];
                const CatIcon = catConfig.icon;
                
                return (
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
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                          statusConfig[event.status].bgColor,
                          statusConfig[event.status].textColor
                        )}>
                          <span className={cn("w-2 h-2 rounded-full", statusConfig[event.status].color)} />
                          {statusConfig[event.status].label}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                          catConfig.bgColor,
                          catConfig.textColor
                        )}>
                          <CatIcon className="w-3 h-3" />
                          {catConfig.label}
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

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          variant={event.status === "ongoing" ? "hero" : "outline"} 
                          className="flex-1"
                        >
                          {event.status === "ongoing" ? "Join Now" : event.status === "upcoming" ? "Register" : "Details"}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                        {event.gallerySlug && (
                          <Button variant="outline" size="icon" asChild>
                            <Link to={`/gallery?event=${event.gallerySlug}`}>
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

            {filteredEvents.length === 0 && (
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
