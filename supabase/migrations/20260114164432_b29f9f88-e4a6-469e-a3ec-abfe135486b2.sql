-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo_url TEXT,
  linkedin_url TEXT,
  instagram_url TEXT,
  email TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Allow public read access (team info is public)
CREATE POLICY "Team members are viewable by everyone"
ON public.team_members
FOR SELECT
USING (true);

-- Create storage bucket for team photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-photos', 'team-photos', true);

-- Allow public read access to team photos
CREATE POLICY "Team photos are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'team-photos');

-- Seed initial team members data
INSERT INTO public.team_members (name, role, display_order) VALUES
  ('Rtr. Reet Sethi', 'President', 1),
  ('Rtr. Gunpreet Singh', 'Vice President', 2),
  ('Rtr. Aviral Sansi', 'Secretary', 3),
  ('Rtr. Rohit Saini', 'Treasurer', 4),
  ('Rtr. Aryan Sanjeev', 'Joint Secretary', 5),
  ('Rtr. Sarthak Bansal', 'Chief Aide To President', 6),
  ('IPP Rtr. Kartik Dawar', 'Club Trainer', 7),
  ('Rtn. Rtr. Rishika Khanna', 'Club Advisor', 8),
  ('Rtr. Prachi Oberoi', 'Club Observer', 9),
  ('Rtr. Sanya Taneja', 'Public Relations Officer', 10),
  ('Rtr. Pratyush Sinha', 'Graphic Designer', 11),
  ('Rtr. Akash Verma', 'Graphics Designer', 12),
  ('Rtr. Riddhi Gupta', 'Club Supervisor', 13),
  ('Rtr. Hunar Khanna', 'Club Administrator', 14),
  ('Rtr. Shweta Ghai', 'Sergeant-At-Arms', 15),
  ('Rtr. Khushi Sethi', 'Directorial Committee Chair', 16),
  ('Rtr. Ojassvi Sharma', 'Community Services Director', 17),
  ('Rtr. Bhavya Mittal', 'Community Services Co-Director', 18),
  ('Rtr. Shivansh Tiwari', 'Vocational Services Director', 19),
  ('Rtr. Divina Khattar', 'Vocational Services Co-Director', 20),
  ('Rtr. Kanav Bhatia', 'Club Services Director', 21),
  ('Rtr. Manasvi Mittal', 'Club Services Co-Director', 22),
  ('Rtr. Prashant Joshi', 'International Services Director', 23),
  ('Rtr. Harshita Agarwal', 'International Services Co-Director', 24),
  ('Rtr. Sanya Maini', 'Video Editor', 25),
  ('Rtr. Naman Rusia', 'Outreach Head', 26),
  ('Rtr. Uttpreksha Tyagi', 'Creative Services Director', 27),
  ('Rtr. Sahib Singh', 'Creative Services Director', 28),
  ('Rtr. Riya Yadav', 'Club Editor', 29),
  ('Rtr. Rishabh Jain', 'Rotaract-Interact Relations', 30);