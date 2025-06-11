
-- Criar tabela de categorias
CREATE TABLE public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de serviços
CREATE TABLE public.services (
  id SERIAL PRIMARY KEY,
  unit_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Políticas para categorias (visíveis para todos os usuários autenticados)
CREATE POLICY "Authenticated users can view categories" 
  ON public.categories 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Políticas para serviços
CREATE POLICY "Users can view approved services" 
  ON public.services 
  FOR SELECT 
  TO authenticated 
  USING (status = 'approved');

CREATE POLICY "Users can view their own services" 
  ON public.services 
  FOR SELECT 
  TO authenticated 
  USING (unit_id = auth.uid());

CREATE POLICY "Users can insert their own services" 
  ON public.services 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (unit_id = auth.uid());

CREATE POLICY "Users can update their own services" 
  ON public.services 
  FOR UPDATE 
  TO authenticated 
  USING (unit_id = auth.uid());

-- Políticas para admins (assumindo que existe uma função is_admin)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND email IN ('admin@evidence.com', 'adm@evidence.com', 'natanaelddd@gmail.com')
  );
$$;

CREATE POLICY "Admins can view all services" 
  ON public.services 
  FOR SELECT 
  TO authenticated 
  USING (public.is_admin());

CREATE POLICY "Admins can update all services" 
  ON public.services 
  FOR UPDATE 
  TO authenticated 
  USING (public.is_admin());

-- Inserir algumas categorias padrão
INSERT INTO public.categories (name, icon) VALUES
  ('Limpeza', '🧹'),
  ('Manutenção', '🔧'),
  ('Jardinagem', '🌱'),
  ('Cuidados', '👶'),
  ('Alimentação', '🍽️'),
  ('Transporte', '🚗'),
  ('Tecnologia', '💻'),
  ('Ensino', '📚'),
  ('Saúde', '🏥'),
  ('Outros', '📦');
