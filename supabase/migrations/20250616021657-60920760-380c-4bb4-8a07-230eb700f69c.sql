
-- Adicionar colunas block e house_number na tabela services
ALTER TABLE public.services 
ADD COLUMN block text,
ADD COLUMN house_number text;

-- Definir valores padrão temporários para registros existentes
UPDATE public.services 
SET block = '1', house_number = '000' 
WHERE block IS NULL OR house_number IS NULL;

-- Tornar as colunas obrigatórias após definir valores padrão
ALTER TABLE public.services 
ALTER COLUMN block SET NOT NULL,
ALTER COLUMN house_number SET NOT NULL;
