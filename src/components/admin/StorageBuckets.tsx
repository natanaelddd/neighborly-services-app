
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const StorageBuckets = () => {
  useEffect(() => {
    createBucketsIfNeeded();
  }, []);

  const createBucketsIfNeeded = async () => {
    try {
      // Verificar e criar bucket service-photos
      const { data: serviceBucket } = await supabase.storage.getBucket('service-photos');
      if (!serviceBucket) {
        await supabase.storage.createBucket('service-photos', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB
        });
      }

      // Verificar e criar bucket property-photos
      const { data: propertyBucket } = await supabase.storage.getBucket('property-photos');
      if (!propertyBucket) {
        await supabase.storage.createBucket('property-photos', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB
        });
      }
    } catch (error) {
      console.error('Erro ao criar buckets:', error);
    }
  };

  return null;
};

export default StorageBuckets;
