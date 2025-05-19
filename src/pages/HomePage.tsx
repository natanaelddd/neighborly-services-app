
import HeroSection from "@/components/HeroSection";
import CategoryList from "@/components/CategoryList";
import FeaturedServices from "@/components/FeaturedServices";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      
      <div className="container-custom py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <img 
              src="/lovable-uploads/85911a86-bc61-477f-aeef-601c1571370b.png"
              alt="Casas do Evidence Resort" 
              className="rounded-2xl shadow-lg border border-gray-100 p-1"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-gradient">Conheça o Evidence Resort</h2>
            <p className="text-muted-foreground mb-4">
              Localizado em uma região privilegiada, o Evidence Resort conta com 5 blocos de casas modernas e confortáveis, 
              projetadas para proporcionar qualidade de vida para você e sua família.
            </p>
            <p className="text-muted-foreground">
              Nossa plataforma exclusiva conecta os moradores do condomínio, permitindo que você 
              encontre ou ofereça serviços dentro da nossa comunidade com facilidade e segurança.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container-custom section-padding">
        <CategoryList />
      </div>
      
      <FeaturedServices />
    </div>
  );
};

export default HomePage;
