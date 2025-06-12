
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const StorageBuckets = () => {
  useEffect(() => {
    const createBucketsIfNeeded = async () => {
      try {
        // Verificar se os buckets existem
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
          console.error('Erro ao listar buckets:', listError);
          return;
        }

        const bucketNames = buckets?.map(bucket => bucket.name) || [];

        // Criar bucket para fotos de serviços se não existir
        if (!bucketNames.includes('service-photos')) {
          const { error } = await supabase.storage.createBucket('service-photos', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
          });
          
          if (error && !error.message.includes('already exists')) {
            console.error('Erro ao criar bucket service-photos:', error);
          }
        }

        // Criar bucket para fotos de propriedades se não existir
        if (!bucketNames.includes('property-photos')) {
          const { error } = await supabase.storage.createBucket('property-photos', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
          });
          
          if (error && !error.message.includes('already exists')) {
            console.error('Erro ao criar bucket property-photos:', error);
          }
        }
      } catch (error) {
        console.error('Erro ao configurar storage buckets:', error);
      }
    };

    createBucketsIfNeeded();
  }, []);

  return null; // Este componente não renderiza nada
};

export default StorageBuckets;
