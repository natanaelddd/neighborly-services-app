
-- Tabela para gerenciar serviços em destaque
CREATE TABLE public.featured_services (
  id SERIAL PRIMARY KEY,
  service_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para gerenciar propriedades em destaque
CREATE TABLE public.featured_properties (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  details TEXT NOT NULL,
  image_url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('venda', 'aluguel')),
  price TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para gerenciar configurações do sistema
CREATE TABLE public.system_settings (
  id SERIAL PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir dados padrão para propriedades em destaque
INSERT INTO public.featured_properties (title, description, details, image_url, type, price) VALUES
('Evidence Resort - Seu novo lar', 'Localizado em uma região privilegiada, o Evidence Resort conta com 5 blocos de casas modernas e confortáveis, projetadas para proporcionar qualidade de vida para você e sua família.', 'Nossa plataforma exclusiva conecta os moradores do condomínio, permitindo que você encontre ou ofereça serviços dentro da nossa comunidade com facilidade e segurança.', '/lovable-uploads/85911a86-bc61-477f-aeef-601c1571370b.png', 'venda', 'A partir de R$ 450.000'),
('Casa Moderna - Bloco 2', 'Casa de 3 quartos com suíte, sala ampla, cozinha planejada e área gourmet. Localizada no Bloco 2 com vista privilegiada para a área verde do condomínio.', 'Acabamento de primeira qualidade, garagem para 2 carros, jardim privativo e acesso direto à área de lazer do condomínio.', '/lovable-uploads/85911a86-bc61-477f-aeef-601c1571370b.png', 'venda', 'R$ 520.000'),
('Casa para Locação - Bloco 4', 'Oportunidade única de morar no Evidence Resort. Casa mobiliada de 2 quartos, ideal para casais ou pequenas famílias que buscam conforto e segurança.', 'Inclui móveis planejados, ar condicionado, área de serviço completa e vaga de garagem coberta.', '/lovable-uploads/85911a86-bc61-477f-aeef-601c1571370b.png', 'aluguel', 'R$ 2.800/mês');

-- Inserir configuração padrão para menu de recomendações
INSERT INTO public.system_settings (setting_key, setting_value) VALUES
('showRecommendationsMenu', 'true');

-- Habilitar RLS (Row Level Security) para todas as tabelas
ALTER TABLE public.featured_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para permitir acesso público (leitura) e admin (escrita)
CREATE POLICY "Public can read featured_services" ON public.featured_services FOR SELECT USING (true);
CREATE POLICY "Admins can manage featured_services" ON public.featured_services FOR ALL USING (public.is_admin());

CREATE POLICY "Public can read featured_properties" ON public.featured_properties FOR SELECT USING (true);
CREATE POLICY "Admins can manage featured_properties" ON public.featured_properties FOR ALL USING (public.is_admin());

CREATE POLICY "Public can read system_settings" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage system_settings" ON public.system_settings FOR ALL USING (public.is_admin());
