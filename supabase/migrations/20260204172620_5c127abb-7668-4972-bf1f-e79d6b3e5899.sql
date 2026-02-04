-- Fix ai_usage_logs RLS policy that allows cross-org access for admins
-- Issue: "Admins can view all AI usage" grants access based solely on Administrator role without org scoping

-- Drop the problematic policy that allows admins to see ALL org data
DROP POLICY IF EXISTS "Admins can view all AI usage" ON public.ai_usage_logs;

-- Create a properly scoped policy for org admins that respects multi-tenant isolation
-- Org admins can only view AI usage logs within their own organization
CREATE POLICY "Org admins can view org AI usage"
ON public.ai_usage_logs
FOR SELECT
TO authenticated
USING (
  org_id IS NOT NULL 
  AND is_org_member(auth.uid(), org_id) 
  AND has_role_by_name(auth.uid(), 'Administrator'::text)
);

-- Note: The existing policies remain intact:
-- - "Users can view own AI usage" (user_id = auth.uid()) - users see their own logs
-- - "Org members can view org AI usage" (is_org_member check) - org members see org logs
-- - "No client writes to AI usage" - blocks direct client inserts
-- The new policy adds org-scoped admin access that doesn't bypass tenant isolation