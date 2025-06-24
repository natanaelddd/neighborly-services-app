
-- Verificar se existem dados nas principais tabelas
SELECT 'Profiles/Clientes:' as tabela, count(*) as total FROM public.profiles
UNION ALL
SELECT 'Serviços:' as tabela, count(*) as total FROM public.services  
UNION ALL
SELECT 'Propriedades:' as tabela, count(*) as total FROM public.properties
UNION ALL
SELECT 'Categorias:' as tabela, count(*) as total FROM public.categories;

-- Ver alguns dados específicos se existirem
SELECT 'Dados de exemplo - Profiles:' as info;
SELECT id, name, email, block, house_number FROM public.profiles LIMIT 5;

SELECT 'Dados de exemplo - Serviços:' as info;
SELECT id, title, description, status FROM public.services LIMIT 5;
