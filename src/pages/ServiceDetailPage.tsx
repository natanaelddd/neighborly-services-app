
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

  const handleContactWhatsApp = () => {
    if (service) {
      window.open(`https://wa.me/${service.whatsapp}?text=Olá! Vi seu serviço de ${service.title} no CondoServ e gostaria de mais informações.`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-16 text-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Serviço não encontrado</h2>
        <p className="mb-6">O serviço que você procura não existe ou foi removido.</p>
        <Button asChild>
          <Link to="/services">Voltar para listagem</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <Link to="/services" className="flex items-center text-brand-blue mb-6 hover:underline">
        <ArrowLeft size={16} className="mr-1" /> Voltar para listagem
      </Link>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
          <div>
            <div className="inline-block bg-brand-light-blue text-brand-blue px-3 py-1 rounded-full text-sm font-medium mb-3">
              {service.category?.name}
            </div>
            <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
            <div className="text-gray-600 mb-4">
              <span className="font-medium text-gray-800">{service.providerName}</span> • 
              Bloco {service.block}, Apto {service.number}
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
        
        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-xl font-semibold mb-4">Descrição</h2>
          <p className="text-gray-700 whitespace-pre-line">{service.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
