
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getServiceById } from "@/data/mockData";
import { ServiceWithProvider } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

const ServiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<ServiceWithProvider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Em um cenário real, isso seria uma chamada de API
      const serviceData = getServiceById(parseInt(id));
      setService(serviceData || null);
      setLoading(false);
    }
  }, [id]);

  const getWhatsAppMessage = () => {
    if (!service) return '';
    
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

  const handleContactWhatsApp = () => {
    if (service) {
      const message = getWhatsAppMessage();
      window.open(`https://wa.me/${service.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-16 text-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Serviço não encontrado</h2>
        <p className="mb-6 text-muted-foreground">O serviço que você procura não existe ou foi removido.</p>
        <Button asChild>
          <Link to="/services">Voltar para listagem</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <Link to="/services" className="flex items-center text-primary mb-6 hover:underline">
        <ArrowLeft size={16} className="mr-1" /> Voltar para listagem
      </Link>
      
      <div className="glass-morphism rounded-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
          <div>
            <div className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              {service.category?.name}
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">{service.title}</h1>
            <div className="text-muted-foreground mb-4">
              <span className="font-medium text-foreground">{service.providerName}</span> • 
              Bloco {service.block}, Casa {service.number}
            </div>
          </div>
          
          <Button 
            onClick={handleContactWhatsApp}
            className="bg-brand-green hover:bg-green-600 mt-4 md:mt-0"
            size="lg"
          >
            Falar no WhatsApp
          </Button>
        </div>
        
        <div className="border-t border-border pt-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Descrição</h2>
          <p className="text-muted-foreground whitespace-pre-line">{service.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
