
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const StorageBuckets = () => {
  useEffect(() => {
    const checkBuckets = async () => {
      try {
        // Apenas verificar se os buckets existem, não tentar criá-los
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
          console.error('Erro ao listar buckets:', error);
          return;
        }

        const bucketNames = buckets?.map(bucket => bucket.name) || [];
        console.log('Buckets disponíveis:', bucketNames);

        // Verificar se os buckets necessários existem
        if (!bucketNames.includes('service-photos')) {
          console.warn('Bucket service-photos não encontrado');
        }

        if (!bucketNames.includes('property-photos')) {
          console.warn('Bucket property-photos não encontrado');
        }
      } catch (error) {
        console.error('Erro ao verificar storage buckets:', error);
      }
    };

    checkBuckets();
  }, []);

  return null; // Este componente não renderiza nada
};

export default StorageBuckets;
