
import { ServiceWithProvider } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbox } from "@/components/ui/lightbox";

// WhatsApp SVG icon (caso não haja em lucide-react)
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width={20}
    height={20}
    fill="currentColor"
    viewBox="0 0 32 32"
    aria-hidden="true"
  >
    <path d="M16 .8C7.73.8.8 7.73.8 16c0 2.82.739 5.54 2.139 7.939L.877 31.092a1.103 1.103 0 0 0 1.039 1.453c.187 0 .385-.045.564-.141l7.221-3.742A14.992 14.992 0 0 0 16 31.2c8.268 0 15.2-6.933 15.2-15.2S24.268.8 16 .8zm0 28.233c-2.524 0-5.011-.673-7.167-1.943l-.511-.299-4.34 2.252 1.115-4.407-.335-.54C3.042 21.027 2.267 18.541 2.267 16c0-7.554 6.153-13.708 13.733-13.708s13.733 6.154 13.733 13.708S23.554 29.033 16 29.033zm7.401-8.39c-.405-.204-2.408-1.19-2.783-1.326-.373-.139-.646-.204-.918.203-.27.402-1.053 1.327-1.293 1.599-.237.271-.474.309-.878.104-.401-.204-1.696-.626-3.235-1.99-1.196-1.063-2.005-2.373-2.241-2.777-.233-.404-.025-.62.175-.82.179-.178.403-.464.605-.695.201-.23.268-.394.404-.661.133-.266.067-.497-.032-.695-.104-.204-.918-2.229-1.257-3.05-.33-.793-.668-.686-.918-.696l-.782-.014c-.263 0-.69.097-1.05.486s-1.373 1.34-1.373 3.266c0 1.927 1.402 3.789 1.599 4.056.199.267 2.758 4.21 6.675 5.506.808.255 1.436.409 1.927.524.81.192 1.547.164 2.133.099.652-.073 2.008-.819 2.292-1.61.283-.79.283-1.467.198-1.61-.08-.138-.293-.223-.6-.362z"/>
  </svg>
);

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

  // Nova função para compartilhar contato via WhatsApp
  const handleShareWhatsApp = () => {
    const shareMessage = `Confira este serviço indicado no Condo Indico:\n\nTítulo: ${service.title}\nCategoria: ${service.category?.name || "-"}\nDescrição: ${service.description}\nContato WhatsApp: https://wa.me/${service.whatsapp}`;
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
            onClick={handleShareWhatsApp}
            variant="secondary"
            className="px-3"
            title="Compartilhar serviço via WhatsApp"
            aria-label="Compartilhar no WhatsApp"
          >
            <WhatsAppIcon className="text-green-500" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;

