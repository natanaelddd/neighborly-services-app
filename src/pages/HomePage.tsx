
import HeroSection from "@/components/HeroSection";
import CategoryList from "@/components/CategoryList";
import FeaturedServices from "@/components/FeaturedServices";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <div className="container-custom section-padding">
        <CategoryList />
      </div>
      <FeaturedServices />
    </div>
  );
};

export default HomePage;
