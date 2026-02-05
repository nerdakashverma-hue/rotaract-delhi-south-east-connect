-- Add parent_event_id column to events table for sub-event grouping
ALTER TABLE public.events 
ADD COLUMN parent_event_id uuid REFERENCES public.events(id) ON DELETE SET NULL;

-- Add an index for faster lookups
CREATE INDEX idx_events_parent_event_id ON public.events(parent_event_id);