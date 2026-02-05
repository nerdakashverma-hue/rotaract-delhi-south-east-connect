import { ChevronDown, Crown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EventCard } from "./EventCard";
import { cn } from "@/lib/utils";

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

interface FlagshipGroup {
  parent: Event;
  children: Event[];
}

interface FlagshipAccordionProps {
  groups: FlagshipGroup[];
}

export function FlagshipAccordion({ groups }: FlagshipAccordionProps) {
  if (groups.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-5 h-5 text-primary" />
        <h3 className="font-display text-xl font-bold">Flagship Events</h3>
      </div>
      
      <Accordion type="multiple" className="space-y-4">
        {groups.map((group) => (
          <AccordionItem 
            key={group.parent.id} 
            value={group.parent.id}
            className="glass-card rounded-2xl border-none overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]]:border-b [&[data-state=open]]:border-border">
              <div className="flex items-center gap-4 flex-1 text-left">
                {group.parent.image_url && (
                  <img 
                    src={group.parent.image_url} 
                    alt={group.parent.title}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Flagship Series
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {group.children.length} phase{group.children.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-bold">{group.parent.title}</h4>
                  {group.parent.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                      {group.parent.description}
                    </p>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-4">
              <div className="space-y-3">
                {group.children.map((event, idx) => (
                  <EventCard key={event.id} event={event} index={idx} compact />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
