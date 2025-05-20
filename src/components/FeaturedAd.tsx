
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FeaturedAd = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <h2 className="text-2xl font-bold text-center py-4 bg-brand-blue text-white">
        Anúncio em Destaque
      </h2>
      
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <img 
            src="/lovable-uploads/85911a86-bc61-477f-aeef-601c1571370b.png"
            alt="Casas do Evidence Resort" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="md:w-1/2 p-6 md:p-8">
          <h3 className="text-2xl font-bold mb-4 text-gradient">
            Evidence Resort - Seu novo lar
          </h3>
          <p className="text-muted-foreground mb-4">
            Localizado em uma região privilegiada, o Evidence Resort conta com 5 blocos de casas modernas e confortáveis, 
            projetadas para proporcionar qualidade de vida para você e sua família.
          </p>
          <p className="text-muted-foreground mb-6">
            Nossa plataforma exclusiva conecta os moradores do condomínio, permitindo que você 
            encontre ou ofereça serviços dentro da nossa comunidade com facilidade e segurança.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-brand-blue hover:bg-blue-700">
              <Link to="/services">
                Explorar Serviços
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">
                Entre em Contato
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedAd;
