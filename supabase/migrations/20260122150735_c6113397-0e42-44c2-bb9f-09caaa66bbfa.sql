-- Ensure RLS is enabled
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

-- Admin CRUD policies for gallery photos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'gallery_photos' AND policyname = 'Admins can insert gallery photos'
  ) THEN
    CREATE POLICY "Admins can insert gallery photos"
    ON public.gallery_photos
    FOR INSERT
    TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'gallery_photos' AND policyname = 'Admins can update gallery photos'
  ) THEN
    CREATE POLICY "Admins can update gallery photos"
    ON public.gallery_photos
    FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'gallery_photos' AND policyname = 'Admins can delete gallery photos'
  ) THEN
    CREATE POLICY "Admins can delete gallery photos"
    ON public.gallery_photos
    FOR DELETE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Create storage bucket for gallery images (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for gallery-images bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Gallery images are publicly accessible'
  ) THEN
    CREATE POLICY "Gallery images are publicly accessible"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'gallery-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can upload gallery images'
  ) THEN
    CREATE POLICY "Admins can upload gallery images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'gallery-images' AND public.has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can update gallery images'
  ) THEN
    CREATE POLICY "Admins can update gallery images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'gallery-images' AND public.has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can delete gallery images'
  ) THEN
    CREATE POLICY "Admins can delete gallery images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'gallery-images' AND public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;