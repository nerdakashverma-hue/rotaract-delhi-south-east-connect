-- Create table for contact/sponsorship submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization_or_event_type TEXT NOT NULL,
  message TEXT NOT NULL,
  form_type TEXT NOT NULL CHECK (form_type IN ('sponsorship', 'event')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for membership applications
CREATE TABLE public.membership_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  occupation TEXT,
  organization TEXT,
  address TEXT,
  why_join TEXT,
  skills TEXT,
  availability TEXT,
  referral_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for gallery photos
CREATE TABLE public.gallery_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  event_name TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

-- Public can insert contact submissions (no auth required for contact forms)
CREATE POLICY "Anyone can submit contact forms" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Public can insert membership applications (no auth required)
CREATE POLICY "Anyone can apply for membership" 
ON public.membership_applications 
FOR INSERT 
WITH CHECK (true);

-- Gallery photos are publicly viewable
CREATE POLICY "Gallery photos are viewable by everyone" 
ON public.gallery_photos 
FOR SELECT 
USING (true);

-- Insert some sample gallery photos
INSERT INTO public.gallery_photos (title, description, image_url, event_name, category) VALUES
('Blood Donation Camp 2024', 'Our annual blood donation drive collecting 50+ units', 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&h=600&fit=crop', 'Blood Donation Camp', 'health'),
('Plantation Drive', 'Team planting saplings in South Delhi parks', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop', 'Green Delhi Initiative', 'environment'),
('Amulya Visit', 'Seeking blessings at the old age home', 'https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=800&h=600&fit=crop', 'Amulya', 'community'),
('Health Camp', 'Free medical checkups for underprivileged', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop', 'Health Camp 2024', 'health'),
('Team Fellowship', 'Bonding session after successful project', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop', 'Fellowship', 'fellowship'),
('Pad Donation Drive', 'Distributing sanitary pads to communities', 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop', 'Menstrual Hygiene', 'health'),
('District Conference', 'RAC DSE representing at District 3011', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', 'District Conference', 'events'),
('Children Education', 'Teaching sessions at community schools', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=600&fit=crop', 'Education Initiative', 'education');