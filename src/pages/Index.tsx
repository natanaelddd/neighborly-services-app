
import HeroSection from "@/components/HeroSection";
import CategoryList from "@/components/CategoryList";
import FeaturedServices from "@/components/FeaturedServices";
import FeaturedAd from "@/components/FeaturedAd";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryList />
      <FeaturedServices />
      <FeaturedAd />
    </div>
  );
};

export default Index;
