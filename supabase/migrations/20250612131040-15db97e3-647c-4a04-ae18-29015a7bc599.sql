
-- Adicionar coluna photo_url na tabela services se não existir
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Criar tabela para múltiplas fotos dos serviços
CREATE TABLE IF NOT EXISTS public.service_photos (
  id SERIAL PRIMARY KEY,
  service_id INTEGER REFERENCES public.services(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para service_photos
ALTER TABLE public.service_photos ENABLE ROW LEVEL SECURITY;

-- Verificar se a política já existe antes de criar
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'service_photos' 
        AND policyname = 'Allow public read access to service photos'
    ) THEN
        CREATE POLICY "Allow public read access to service photos" ON public.service_photos
        FOR SELECT USING (true);
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'service_photos' 
        AND policyname = 'Allow users to manage their service photos'
    ) THEN
        CREATE POLICY "Allow users to manage their service photos" ON public.service_photos
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM public.services 
            WHERE services.id = service_photos.service_id 
            AND services.unit_id = auth.uid()
          )
        );
    END IF;
END
$$;

-- Adicionar ordem às categorias para drag and drop
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Atualizar ordem existente das categorias
UPDATE public.categories 
SET display_order = id 
WHERE display_order = 0;
