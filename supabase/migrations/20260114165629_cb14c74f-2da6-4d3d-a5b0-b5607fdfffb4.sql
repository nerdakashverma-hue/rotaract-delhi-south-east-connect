-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Add UPDATE policy for team_members (admins only)
CREATE POLICY "Admins can update team members"
ON public.team_members
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add INSERT policy for team_members (admins only)
CREATE POLICY "Admins can insert team members"
ON public.team_members
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add DELETE policy for team_members (admins only)
CREATE POLICY "Admins can delete team members"
ON public.team_members
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Storage policies for team-photos bucket (admins can upload)
CREATE POLICY "Admins can upload team photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'team-photos' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update team photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'team-photos' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete team photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'team-photos' 
  AND public.has_role(auth.uid(), 'admin')
);