
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RecommendationsPage = () => {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const navigate = useNavigate();
  
  // Check if recommendations feature is enabled
  useEffect(() => {
    const storedValue = localStorage.getItem("showRecommendationsMenu");
    if (storedValue) {
      setShowRecommendations(JSON.parse(storedValue));
    }
    
    // If recommendations are disabled, redirect to homepage
    if (!storedValue || storedValue === "false") {
      navigate("/");
    }
  }, [navigate]);
  
  // Update document title
  useEffect(() => {
    document.title = "Indicações - Vitrine Evidence";
  }, []);

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
