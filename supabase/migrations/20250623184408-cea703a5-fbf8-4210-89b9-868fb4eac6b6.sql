
-- Primeiro, vamos inserir dados que não dependem de autenticação
-- Vamos usar dados temporários para demonstração

-- Remover a restrição temporariamente para inserir dados de exemplo
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Inserir perfis de exemplo sem referência ao auth.users
INSERT INTO public.profiles (id, name, email, block, house_number, whatsapp) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Maria Silva', 'maria.silva@email.com', 'A', '101', '11999887766'),
('550e8400-e29b-41d4-a716-446655440002', 'João Santos', 'joao.santos@email.com', 'B', '205', '11998776655'),
('550e8400-e29b-41d4-a716-446655440003', 'Ana Costa', 'ana.costa@email.com', 'A', '304', '11997665544'),
('550e8400-e29b-41d4-a716-446655440004', 'Carlos Lima', 'carlos.lima@email.com', 'C', '102', '11996554433'),
('550e8400-e29b-41d4-a716-446655440005', 'Fernanda Oliveira', 'fernanda.oliveira@email.com', 'B', '401', '11995443322');

-- Inserir serviços de exemplo
INSERT INTO public.services (unit_id, category_id, title, description, whatsapp, status, block, house_number) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1, 'Limpeza Residencial Completa', 'Serviço de limpeza completa para sua casa. Experiência de 5 anos no mercado.', '11999887766', 'approved', 'A', '101'),
('550e8400-e29b-41d4-a716-446655440002', 2, 'Manutenção Elétrica e Hidráulica', 'Serviços de eletricista e encanador. Atendimento 24h para emergências.', '11998776655', 'approved', 'B', '205'),
('550e8400-e29b-41d4-a716-446655440003', 3, 'Jardinagem e Paisagismo', 'Cuidamos do seu jardim com carinho. Poda, plantio e manutenção de plantas.', '11997665544', 'approved', 'A', '304'),
('550e8400-e29b-41d4-a716-446655440004', 4, 'Pet Sitting e Dog Walking', 'Cuidamos do seu pet com muito amor. Passeios e cuidados quando você não estiver.', '11996554433', 'approved', 'C', '102'),
('550e8400-e29b-41d4-a716-446655440005', 5, 'Delivery de Comida Caseira', 'Comida caseira fresquinha direto na sua porta. Cardápio variado toda semana.', '11995443322', 'approved', 'B', '401'),
('550e8400-e29b-41d4-a716-446655440001', 6, 'Manicure e Pedicure', 'Serviços de beleza no conforto da sua casa. Agenda flexível e produtos de qualidade.', '11999887766', 'approved', 'A', '101');

-- Inserir propriedades de exemplo
INSERT INTO public.properties (unit_id, title, description, type, price, bedrooms, garage_covered, is_renovated, whatsapp, status) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Apartamento 3 Quartos - Bloco B', 'Lindo apartamento com 3 quartos, 2 banheiros, sala ampla e cozinha planejada.', 'venda', 'R$ 450.000', 3, true, true, '11998776655', 'approved'),
('550e8400-e29b-41d4-a716-446655440003', 'Casa Térrea - Bloco A', 'Casa térrea com quintal, 2 quartos, garagem coberta e área de lazer.', 'aluguel', 'R$ 2.500/mês', 2, true, false, '11997665544', 'approved'),
('550e8400-e29b-41d4-a716-446655440004', 'Cobertura Duplex - Bloco C', 'Cobertura duplex com terraço, churrasqueira e vista privilegiada.', 'venda', 'R$ 680.000', 4, true, true, '11996554433', 'approved');
