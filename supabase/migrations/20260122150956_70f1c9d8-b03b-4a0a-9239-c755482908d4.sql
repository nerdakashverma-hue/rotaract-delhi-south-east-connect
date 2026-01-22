-- Tighten public INSERT policies to avoid overly-permissive (true) checks while keeping public form submissions

-- contact_submissions
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='contact_submissions' AND policyname='Anyone can submit contact forms'
  ) THEN
    DROP POLICY "Anyone can submit contact forms" ON public.contact_submissions;
  END IF;

  CREATE POLICY "Anyone can submit contact forms"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(name)) > 0
    AND length(trim(email)) > 3
    AND position('@' in email) > 1
    AND length(trim(form_type)) > 0
    AND length(trim(message)) > 0
    AND length(trim(organization_or_event_type)) > 0
  );
END $$;

-- membership_applications
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='membership_applications' AND policyname='Anyone can apply for membership'
  ) THEN
    DROP POLICY "Anyone can apply for membership" ON public.membership_applications;
  END IF;

  CREATE POLICY "Anyone can apply for membership"
  ON public.membership_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(full_name)) > 0
    AND length(trim(email)) > 3
    AND position('@' in email) > 1
    AND length(trim(phone)) > 0
  );
END $$;