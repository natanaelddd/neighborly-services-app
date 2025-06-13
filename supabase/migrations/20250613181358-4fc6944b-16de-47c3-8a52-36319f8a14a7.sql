
-- Create storage bucket for property photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-photos', 'property-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for property photos bucket
CREATE POLICY "Anyone can view property photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-photos');

CREATE POLICY "Authenticated users can upload property photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'property-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own property photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'property-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own property photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'property-photos' AND auth.role() = 'authenticated');
