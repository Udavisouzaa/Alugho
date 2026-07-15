-- Fix mutable search_path on trigger functions
ALTER FUNCTION public.handle_new_tenant_login() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;

-- Revoke direct RPC execution of trigger-only function
REVOKE ALL ON FUNCTION public.handle_new_tenant_login() FROM PUBLIC, anon, authenticated;

-- Restrict maintenance_photos bucket: remove broad listing policy, keep scoped object access
DROP POLICY IF EXISTS "Anyone can view photos" ON storage.objects;
CREATE POLICY "Owners and tenants can view their maintenance photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'maintenance_photos'
    AND (
      auth.uid() IN (SELECT user_id FROM public.properties)
      OR auth.uid() IN (SELECT auth_id FROM public.tenants WHERE auth_id IS NOT NULL)
    )
  );
