
import { ServiceWithProvider } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbox } from "@/components/ui/lightbox";
import { Share, MapPin, Phone } from "lucide-react";

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
    // Mensagem recomendando o contato, com número clicável para WhatsApp e link do site
    const shareMessage =
      `Recomendo este serviço do Condo Indico:\n\n` +
      `${service.title} por ${service.providerName}\n` +
      `Bloco ${service.block}, Casa ${service.number}\n` +
      `Fale com: https://wa.me/${service.whatsapp}\n\n` +
      `Veja mais em: https://www.condoindico.com.br`;
    // Abre o WhatsApp Web/aplicativo já com a mensagem modelo preenchida
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, "_blank");
  };

  const handleContactWhatsApp = () => {
    const message = getWhatsAppMessage();
    window.open(`https://wa.me/${service.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Card className="service-card h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            {service.category && (
              <div className="text-xs text-primary font-medium mb-2">
                {service.category.name}
              </div>
            )}
            <h3 className="font-semibold text-lg text-foreground leading-tight mb-2">
              {service.title}
            </h3>
            
            {/* DESTAQUE PARA NÚMERO DA CASA */}
            <div className="flex items-center gap-2 bg-primary/10 px-2 py-1 rounded-md w-fit">
              <MapPin className="w-3 h-3 text-primary" />
              <span className="text-xs font-semibold text-primary">
                Casa {service.number} - Bloco {service.block}
              </span>
            </div>
          </div>
          
          <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 shrink-0">
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
      
      <CardContent className="flex-grow pt-0">
        <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
          {service.description}
        </p>
        
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{service.providerName}</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-3 border-t border-border">
        <Button
          onClick={handleContactWhatsApp}
          className="flex-1 bg-brand-green hover:bg-green-600 text-sm"
        >
          <Phone className="w-4 h-4 mr-1" />
          WhatsApp
        </Button>
        <Button
          onClick={handleShareWhatsAppContact}
          variant="secondary"
          className="px-3"
          title="Compartilhar contato do serviço pelo WhatsApp"
          aria-label="Compartilhar contato do serviço"
        >
          <Share className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
