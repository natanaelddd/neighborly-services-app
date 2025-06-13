
-- Drop existing policies that might conflict and recreate them
DROP POLICY IF EXISTS "Allow users to update their own properties" ON public.properties;
DROP POLICY IF EXISTS "Allow users to delete their own properties" ON public.properties;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own properties" ON public.properties;
DROP POLICY IF EXISTS "Allow admins to manage all properties" ON public.properties;

-- Recreate the essential policies for properties
CREATE POLICY "Allow authenticated users to insert their own properties" ON public.properties
FOR INSERT WITH CHECK (auth.uid() = unit_id);

CREATE POLICY "Allow users to update their own properties" ON public.properties
FOR UPDATE USING (auth.uid() = unit_id);

CREATE POLICY "Allow users to delete their own properties" ON public.properties
FOR DELETE USING (auth.uid() = unit_id);

CREATE POLICY "Allow admins to manage all properties" ON public.properties
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND email IN ('admin@evidence.com', 'adm@evidence.com', 'natanaelddd@gmail.com')
  )
);
