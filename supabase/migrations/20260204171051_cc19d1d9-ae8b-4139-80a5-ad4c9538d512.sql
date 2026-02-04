-- =====================================================
-- SECURITY FIX: Remove Anonymous Insert Policies
-- =====================================================

-- 1. Fix leads table: Remove anonymous insert policies
DROP POLICY IF EXISTS "Anonymous can submit leads" ON public.leads;
DROP POLICY IF EXISTS "leads_insert_all" ON public.leads;

-- Keep only authenticated insert
CREATE POLICY "Authenticated users can submit leads" 
ON public.leads 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- 2. Fix calculations table: Remove anonymous insert
DROP POLICY IF EXISTS "calculations_insert_anon" ON public.calculations;

CREATE POLICY "Authenticated users can insert calculations" 
ON public.calculations 
FOR INSERT 
TO authenticated
WITH CHECK (
  user_id = auth.uid() 
  OR (user_id IS NULL AND auth.uid() IS NOT NULL)
);

-- 3. Fix generated_documents: Remove anonymous insert
DROP POLICY IF EXISTS "gendocs_insert_anon" ON public.generated_documents;

-- 4. Fix tool_usage_limits: Remove anonymous insert
DROP POLICY IF EXISTS "usage_insert_anon" ON public.tool_usage_limits;

CREATE POLICY "Authenticated users can insert usage limits" 
ON public.tool_usage_limits 
FOR INSERT 
TO authenticated
WITH CHECK (
  user_id = auth.uid() 
  OR (user_id IS NULL AND auth.uid() IS NOT NULL)
);

-- 5. Fix apps_registry: Remove overly permissive allow_all policy
DROP POLICY IF EXISTS "allow_all" ON public.apps_registry;

-- Only allow reads for apps that are public or active
CREATE POLICY "Public apps are readable" 
ON public.apps_registry 
FOR SELECT 
TO authenticated
USING (is_public = true OR is_active = true);

-- Only owners can modify apps_registry
CREATE POLICY "Org owners can modify apps_registry"
ON public.apps_registry
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM org_memberships
    WHERE org_memberships.user_id = auth.uid() 
    AND org_memberships.role = 'owner'
    AND org_memberships.status = 'active'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM org_memberships
    WHERE org_memberships.user_id = auth.uid() 
    AND org_memberships.role = 'owner'
    AND org_memberships.status = 'active'
  )
);