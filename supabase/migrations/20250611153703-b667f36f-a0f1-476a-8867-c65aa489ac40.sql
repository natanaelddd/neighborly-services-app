
-- Adicionar coluna photo_url na tabela services para armazenar imagens dos serviços
ALTER TABLE public.services 
ADD COLUMN photo_url TEXT;

-- Adicionar comentário para documentar o campo
COMMENT ON COLUMN public.services.photo_url IS 'URL da foto/imagem do serviço';
