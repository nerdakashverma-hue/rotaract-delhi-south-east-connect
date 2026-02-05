import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowRight, Camera, Crown, Globe, Heart, Briefcase, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  flagship: { label: "Flagship", icon: Crown, color: "bg-primary", bgColor: "bg-primary/10", textColor: "text-primary" },
  international: { label: "International", icon: Globe, color: "bg-blue-500", bgColor: "bg-blue-500/10", textColor: "text-blue-600" },
  community: { label: "Community", icon: Heart, color: "bg-rose-500", bgColor: "bg-rose-500/10", textColor: "text-rose-600" },
  vocational: { label: "Vocational", icon: Briefcase, color: "bg-amber-500", bgColor: "bg-amber-500/10", textColor: "text-amber-600" },
  club: { label: "Club Service", icon: Handshake, color: "bg-emerald-500", bgColor: "bg-emerald-500/10", textColor: "text-emerald-600" },
};

const statusConfig = {
  ongoing: { label: "Currently Active", color: "bg-green-500", bgColor: "bg-green-500/10", textColor: "text-green-600" },
  upcoming: { label: "Coming Soon", color: "bg-secondary", bgColor: "bg-secondary/10", textColor: "text-secondary" },
  past: { label: "Completed", color: "bg-muted-foreground", bgColor: "bg-muted", textColor: "text-muted-foreground" },
};

interface EventCardProps {
  event: Event;
  index?: number;
  compact?: boolean;
}

export function EventCard({ event, index = 0, compact = false }: EventCardProps) {
  const catConfig = categoryConfig[(event.category as EventCategory) || "community"];
  const statConfig = statusConfig[(event.status as EventStatus) || "past"];
  const CatIcon = catConfig?.icon || Heart;

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
        {event.image_url && (
          <img src={event.image_url} alt={event.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold truncate">{event.title}</h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Calendar className="w-3 h-3" />
            {event.date}
            {event.location && (
              <>
                <span className="text-border">|</span>
                <MapPin className="w-3 h-3" />
                {event.location}
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Details
            <ArrowRight className="w-3 h-3" />
          </Button>
          {event.gallery_slug && (
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <Link to={`/gallery?event=${event.gallery_slug}`}>
                <Camera className="w-3 h-3" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
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
}
