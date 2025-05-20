
import HeroSection from "@/components/HeroSection";
import CategoryList from "@/components/CategoryList";
import FeaturedServices from "@/components/FeaturedServices";
import FeaturedAd from "@/components/FeaturedAd";

const HomePage = () => {
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
    </div>
  );
};

export default HomePage;
