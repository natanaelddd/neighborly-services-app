
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const StorageBuckets = () => {
  useEffect(() => {
    const checkBuckets = async () => {
      try {
        // Verificar se os buckets existem
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
          console.error('Erro ao listar buckets:', error);
          return;
        }

        const bucketNames = buckets?.map(bucket => bucket.name) || [];
        console.log('Buckets disponíveis:', bucketNames);

        // Verificar buckets necessários
        const requiredBuckets = ['service-photos', 'property-photos'];
        const missingBuckets = requiredBuckets.filter(bucket => !bucketNames.includes(bucket));
        
        if (missingBuckets.length === 0) {
          console.log('✅ Todos os buckets necessários estão configurados');
        } else {
          console.warn('⚠️ Buckets faltando:', missingBuckets);
        }

        // Testar se conseguimos fazer upload
        try {
          const testFile = new Blob(['test'], { type: 'text/plain' });
          const testFileName = `test-${Date.now()}.txt`;
          
          const { error: uploadError } = await supabase.storage
            .from('service-photos')
            .upload(testFileName, testFile);

          if (!uploadError) {
            console.log('✅ Upload de teste funcionando');
            // Limpar arquivo de teste
            await supabase.storage
              .from('service-photos')
              .remove([testFileName]);
          } else {
            console.warn('⚠️ Erro no upload de teste:', uploadError);
          }
        } catch (testError) {
          console.warn('⚠️ Erro no teste de upload:', testError);
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
