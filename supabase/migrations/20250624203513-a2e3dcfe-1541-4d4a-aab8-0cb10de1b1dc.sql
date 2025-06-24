
-- Criar os buckets de storage necessários (se não existirem)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('service-photos', 'service-photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-photos', 'property-photos', true) 
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas de acesso para service-photos diretamente
DROP POLICY IF EXISTS "Public read service photos" ON storage.objects;
DROP POLICY IF EXISTS "Auth upload service photos" ON storage.objects;
DROP POLICY IF EXISTS "Public read property photos" ON storage.objects;
DROP POLICY IF EXISTS "Auth upload property photos" ON storage.objects;

CREATE POLICY "Public read service photos" ON storage.objects
FOR SELECT USING (bucket_id = 'service-photos');

CREATE POLICY "Auth upload service photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'service-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Public read property photos" ON storage.objects
FOR SELECT USING (bucket_id = 'property-photos');

CREATE POLICY "Auth upload property photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'property-photos' AND auth.role() = 'authenticated');

-- Habilitar RLS nas tabelas principais
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_photos ENABLE ROW LEVEL SECURITY;

-- Remover políticas conflitantes se existirem e recriar
DROP POLICY IF EXISTS "Public can view approved services" ON public.services;
DROP POLICY IF EXISTS "Public can view approved properties" ON public.properties;
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can create services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can create properties" ON public.properties;
DROP POLICY IF EXISTS "Users can view their own services" ON public.services;
DROP POLICY IF EXISTS "Users can view their own properties" ON public.properties;
DROP POLICY IF EXISTS "Users can update their own services" ON public.services;
DROP POLICY IF EXISTS "Users can update their own properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can manage all services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage all properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;

-- Recriar políticas para as tabelas principais
CREATE POLICY "Public can view approved services" ON public.services
FOR SELECT USING (status = 'approved');

CREATE POLICY "Public can view approved properties" ON public.properties  
FOR SELECT USING (status = 'approved');

CREATE POLICY "Public can view categories" ON public.categories
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create services" ON public.services
FOR INSERT WITH CHECK (auth.uid() = unit_id);

CREATE POLICY "Authenticated users can create properties" ON public.properties
FOR INSERT WITH CHECK (auth.uid() = unit_id);

CREATE POLICY "Users can view their own services" ON public.services
FOR SELECT USING (auth.uid() = unit_id);

CREATE POLICY "Users can view their own properties" ON public.properties
FOR SELECT USING (auth.uid() = unit_id);

CREATE POLICY "Users can update their own services" ON public.services
FOR UPDATE USING (auth.uid() = unit_id);

CREATE POLICY "Users can update their own properties" ON public.properties
FOR UPDATE USING (auth.uid() = unit_id);

CREATE POLICY "Admins can manage all services" ON public.services
FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage all properties" ON public.properties
FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage categories" ON public.categories
FOR ALL USING (public.is_admin());

-- Políticas para tabelas de fotos
DROP POLICY IF EXISTS "Public can view service photos" ON public.service_photos;
DROP POLICY IF EXISTS "Public can view property photos" ON public.property_photos;
DROP POLICY IF EXISTS "Authenticated users can manage service photos" ON public.service_photos;
DROP POLICY IF EXISTS "Authenticated users can manage property photos" ON public.property_photos;

CREATE POLICY "Public can view service photos" ON public.service_photos
FOR SELECT USING (true);

CREATE POLICY "Public can view property photos" ON public.property_photos
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage service photos" ON public.service_photos
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage property photos" ON public.property_photos
FOR ALL USING (auth.role() = 'authenticated');
