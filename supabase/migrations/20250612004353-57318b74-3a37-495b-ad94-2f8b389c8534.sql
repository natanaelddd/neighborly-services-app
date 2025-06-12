
-- Criar tabela para residências/casas
CREATE TABLE IF NOT EXISTS public.properties (
  id SERIAL PRIMARY KEY,
  unit_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'venda', -- 'venda' ou 'aluguel'
  price TEXT,
  bedrooms INTEGER NOT NULL DEFAULT 3,
  garage_covered BOOLEAN DEFAULT false,
  is_renovated BOOLEAN DEFAULT false,
  whatsapp TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para fotos das residências
CREATE TABLE IF NOT EXISTS public.property_photos (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES public.properties(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar bucket para fotos das propriedades
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-photos', 'property-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Criar bucket para fotos dos serviços
INSERT INTO storage.buckets (id, name, public) 
VALUES ('service-photos', 'service-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para property-photos bucket
CREATE POLICY "Allow public read access on property photos" ON storage.objects
FOR SELECT USING (bucket_id = 'property-photos');

CREATE POLICY "Allow authenticated users to upload property photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'property-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own property photos" ON storage.objects
FOR UPDATE USING (bucket_id = 'property-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to delete their own property photos" ON storage.objects
FOR DELETE USING (bucket_id = 'property-photos' AND auth.role() = 'authenticated');

-- Políticas para service-photos bucket
CREATE POLICY "Allow public read access on service photos" ON storage.objects
FOR SELECT USING (bucket_id = 'service-photos');

CREATE POLICY "Allow authenticated users to upload service photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'service-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own service photos" ON storage.objects
FOR UPDATE USING (bucket_id = 'service-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to delete their own service photos" ON storage.objects
FOR DELETE USING (bucket_id = 'service-photos' AND auth.role() = 'authenticated');

-- RLS para properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to approved properties" ON public.properties
FOR SELECT USING (status = 'approved');

CREATE POLICY "Allow users to insert their own properties" ON public.properties
FOR INSERT WITH CHECK (auth.uid() = unit_id);

CREATE POLICY "Allow users to update their own properties" ON public.properties
FOR UPDATE USING (auth.uid() = unit_id);

-- RLS para property_photos
ALTER TABLE public.property_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to property photos" ON public.property_photos
FOR SELECT USING (true);

CREATE POLICY "Allow users to manage their property photos" ON public.property_photos
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = property_photos.property_id 
    AND properties.unit_id = auth.uid()
  )
);
