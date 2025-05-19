
import { ServiceWithProvider } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  service: ServiceWithProvider;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const handleContactWhatsApp = () => {
    window.open(`https://wa.me/${service.whatsapp}?text=Olá! Vi seu serviço de ${service.title} no CondoServ e gostaria de mais informações.`, '_blank');
  };

  return (
    <Card className="service-card h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs text-brand-blue font-medium mb-1">
              {service.category?.name}
            </div>
            <h3 className="font-medium text-lg">{service.title}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 text-sm line-clamp-3">
          {service.description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-2 border-t">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="font-medium text-gray-700">{service.providerName}</span>
          <span className="mx-2">•</span>
          <span>Bloco {service.block}, Apto {service.number}</span>
        </div>
        <Button 
          onClick={handleContactWhatsApp}
          className="w-full bg-brand-green hover:bg-green-600"
        >
          Falar no WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
