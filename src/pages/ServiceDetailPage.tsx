
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, MapPin } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { ServiceWithProvider } from "@/types";

const ServiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<ServiceWithProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) {
        setError("ID do serviço não encontrado");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('services')
          .select(`
            *,
            profiles:unit_id (name, block, house_number),
            categories:category_id (id, name, icon, created_at, updated_at)
          `)
          .eq('id', parseInt(id))
          .eq('status', 'approved')
          .single();

        if (error) {
          console.error('Erro ao buscar serviço:', error);
          setError("Serviço não encontrado");
          setLoading(false);
          return;
        }

        if (data) {
          const transformedService: ServiceWithProvider = {
            id: data.id,
            unitId: data.unit_id || '',
            categoryId: data.category_id || 0,
            title: data.title,
            description: data.description,
            photoUrl: data.photo_url || '',
            whatsapp: data.whatsapp,
            status: data.status as 'pending' | 'approved' | 'rejected',
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            providerName: data.profiles?.name || 'Morador não identificado',
            block: data.profiles?.block || '',
            number: data.profiles?.house_number || '',
            category: data.categories ? {
              id: data.categories.id || data.category_id || 0,
              name: data.categories.name,
              icon: data.categories.icon,
              created_at: data.categories.created_at || '',
              updated_at: data.categories.updated_at || ''
            } : undefined
          };

          setService(transformedService);
        } else {
          setError("Serviço não encontrado");
        }
      } catch (error) {
        console.error('Erro ao carregar serviço:', error);
        setError("Erro ao carregar serviço");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
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
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <p className="text-muted-foreground mt-4">Carregando serviço...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Serviço não encontrado</h2>
        <p className="mb-6 text-muted-foreground">{error || "O serviço que você procura não existe ou foi removido."}</p>
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
          <div className="flex-1">
            {service.category && (
              <div className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
                {service.category.name}
              </div>
            )}
            <h1 className="text-3xl font-bold mb-4 text-foreground">{service.title}</h1>
            
            {/* Informações do prestador - DESTAQUE PARA CASA */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-xs">
                      {service.providerName?.charAt(0) || '?'}
                    </span>
                  </div>
                  <span className="font-medium text-foreground">{service.providerName}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-primary/20">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-primary">
                    Bloco {service.block}, Casa {service.number}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleContactWhatsApp}
            className="bg-brand-green hover:bg-green-600 mt-4 md:mt-0 flex items-center gap-2"
            size="lg"
          >
            <Phone className="w-4 h-4" />
            Falar no WhatsApp
          </Button>
        </div>
        
        <div className="border-t border-border pt-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Descrição</h2>
          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{service.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
