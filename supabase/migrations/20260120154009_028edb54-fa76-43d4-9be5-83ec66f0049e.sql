-- Add category and gallery_slug columns to events table
ALTER TABLE public.events 
ADD COLUMN category TEXT DEFAULT 'community',
ADD COLUMN gallery_slug TEXT;