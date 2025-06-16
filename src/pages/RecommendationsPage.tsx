
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const RecommendationsPage = () => {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Check if recommendations feature is enabled from database
  useEffect(() => {
    const checkRecommendationsStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('setting_value')
          .eq('setting_key', 'showRecommendationsMenu')
          .single();

        if (!error && data) {
          const isEnabled = data.setting_value as boolean;
          setShowRecommendations(isEnabled);
          
          // If recommendations are disabled, redirect to homepage
          if (!isEnabled) {
            navigate("/");
            return;
          }
        } else {
          // If no setting found, default to disabled and redirect
          navigate("/");
          return;
        }
      } catch (error) {
        console.error('Erro ao verificar status das recomendações:', error);
        navigate("/");
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkRecommendationsStatus();
  }, [navigate]);
  
  // Update document title
  useEffect(() => {
    document.title = "Indicações - Vitrine Evidence";
  }, []);

  if (isLoading) {
    return (
      <div className="container-custom py-10">
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!showRecommendations) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold mb-6">Indicações</h1>
      <p className="text-lg text-muted-foreground">
        Esta página está em desenvolvimento. Em breve você poderá ver serviços recomendados
        por moradores do condomínio.
      </p>
    </div>
  );
};

export default RecommendationsPage;
