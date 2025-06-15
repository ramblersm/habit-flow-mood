
-- Update the handle_new_user function to not set setup_completed to false automatically
-- This allows the onboarding flow to handle profile creation properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert basic profile data, let onboarding handle the rest
  INSERT INTO public.profiles (id, email)
  VALUES (
    NEW.id,
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent duplicate inserts
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
