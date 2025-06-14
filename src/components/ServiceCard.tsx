
import { ServiceWithProvider } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbox } from "@/components/ui/lightbox";
import { Share } from "lucide-react";

interface ServiceCardProps {
  service: ServiceWithProvider;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const getWhatsAppMessage = () => {
    const baseMessage = `Olá! Vim do site Condo Indico e vi seu serviço de ${service.title}.`;
    // Categorias que normalmente requerem orçamento
    const serviceCategories = [
      'manutenção', 'reforma', 'construção', 'jardinagem', 'pintura',
      'eletricista', 'encanador', 'marceneiro', 'pedreiro', 'serralheiro'
    ];
    const categoryName = service.category?.name?.toLowerCase() || '';
    const isServiceCategory = serviceCategories.some(cat =>
      categoryName.includes(cat) || service.title.toLowerCase().includes(cat)
    );
    if (isServiceCategory) {
      return `${baseMessage} Gostaria de solicitar um orçamento. Você está disponível para conversar?`;
    } else {
      return `${baseMessage} Gostaria de mais informações sobre seus serviços. Você está disponível para conversar?`;
    }
  };

  // Compartilhamento do contato para indicação por WhatsApp
  const handleShareWhatsAppContact = () => {
    // Mensagem recomendando o contato, com número clicável para WhatsApp
    const shareMessage =
      `Recomendo este serviço do Condo Indico:\n\n` +
      `${service.title} por ${service.providerName}\n` +
      `Fale com: https://wa.me/${service.whatsapp}\n\n` +
      `Enviei pelo Condo Indico!`;
    // Abre o WhatsApp Web/aplicativo já com a mensagem modelo preenchida
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, "_blank");
  };

  const handleContactWhatsApp = () => {
    const message = getWhatsAppMessage();
    window.open(`https://wa.me/${service.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Card className="service-card h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="text-xs text-primary font-medium mb-1">
              {service.category?.name}
            </div>
            <h3 className="font-medium text-lg text-foreground">{service.title}</h3>
          </div>
          <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 ml-2">
            <Lightbox
              src={service.photoUrl || "/placeholder.svg"}
              alt={service.photoUrl ? `Logo de ${service.title}` : "Logo Condo Indico"}
              trigger={
                <img
                  src={service.photoUrl || "/placeholder.svg"}
                  alt={service.photoUrl ? `Logo de ${service.title}` : "Logo Condo Indico"}
                  className="w-full h-full object-cover hover:opacity-80 transition-opacity cursor-pointer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              }
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {service.description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-2 border-t border-border">
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <span className="font-medium text-foreground">{service.providerName}</span>
          <span className="mx-2">•</span>
          <span>Bloco {service.block}, Casa {service.number}</span>
        </div>
        <div className="flex w-full gap-2">
          <Button
            onClick={handleContactWhatsApp}
            className="flex-1 bg-brand-green hover:bg-green-600"
          >
            Falar no WhatsApp
          </Button>
          <Button
            onClick={handleShareWhatsAppContact}
            variant="secondary"
            className="px-3"
            title="Compartilhar contato do serviço pelo WhatsApp"
            aria-label="Compartilhar contato do serviço"
          >
            <Share className="text-primary" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;

