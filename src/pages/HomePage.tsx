
import HeroSection from "@/components/HeroSection";
import CategoryList from "@/components/CategoryList";
import FeaturedServices from "@/components/FeaturedServices";
import FeaturedAd from "@/components/FeaturedAd";
import DatabaseStatus from "@/components/DatabaseStatus";
import { useEffect } from "react";

const HomePage = () => {
  // Update document title
  useEffect(() => {
    document.title = "Condo Indico - Serviços para o seu condomínio";
  }, []);

  return (
    <div>
      <HeroSection />
      
      <div className="container-custom py-16 bg-gradient-to-b from-white to-gray-50">
        <FeaturedAd />
      </div>
      
      <div className="container-custom section-padding">
        <CategoryList />
      </div>
      
      <FeaturedServices />
      
      {/* Debug component - remova em produção */}
      <DatabaseStatus />
    </div>
  );
};

export default HomePage;
