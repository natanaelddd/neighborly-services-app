
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/types";

interface ServiceManagerProps {
  services: Service[];
  setServices: (services: Service[]) => void;
}

const ServiceManager = ({ services, setServices }: ServiceManagerProps) => {
  const handleApprove = async (serviceId: number) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', serviceId);

      if (error) {
        console.error('Erro ao aprovar serviço:', error);
        toast.error("Erro ao aprovar serviço");
        return;
      }

      setServices(services.map(service => 
        service.id === serviceId ? { ...service, status: "approved" } : service
      ));
      toast.success("Serviço aprovado com sucesso!");
    } catch (error) {
      console.error('Erro ao aprovar serviço:', error);
      toast.error("Erro ao aprovar serviço");
    }
  };

  const handleReject = async (serviceId: number) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', serviceId);

      if (error) {
        console.error('Erro ao rejeitar serviço:', error);
        toast.error("Erro ao rejeitar serviço");
        return;
      }

      setServices(services.map(service => 
        service.id === serviceId ? { ...service, status: "rejected" } : service
      ));
      toast.success("Serviço rejeitado!");
    } catch (error) {
      console.error('Erro ao rejeitar serviço:', error);
      toast.error("Erro ao rejeitar serviço");
    }
  };

  const handleUpdateService = async (serviceId: number, updatedData: Partial<Service>) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({
          title: updatedData.title,
          description: updatedData.description,
          whatsapp: updatedData.whatsapp,
          category_id: updatedData.categoryId,
          block: updatedData.block,
          house_number: updatedData.house_number,
          status: updatedData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', serviceId);

      if (error) {
        console.error('Erro ao atualizar serviço:', error);
        toast.error("Erro ao atualizar serviço");
        return;
      }

      setServices(services.map(service => 
        service.id === serviceId ? { ...service, ...updatedData } : service
      ));
      toast.success("Serviço atualizado com sucesso!");
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      toast.error("Erro ao atualizar serviço");
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    try {
      console.log('Iniciando exclusão do serviço:', serviceId);
      
      // Primeiro, remover o serviço dos destaques no localStorage
      const featuredServiceIdsStr = localStorage.getItem('featuredServiceIds');
      if (featuredServiceIdsStr) {
        try {
          const featuredServiceIds: number[] = JSON.parse(featuredServiceIdsStr);
          if (Array.isArray(featuredServiceIds)) {
            const updatedFeatured = featuredServiceIds.filter(id => id !== serviceId);
            localStorage.setItem('featuredServiceIds', JSON.stringify(updatedFeatured));
            console.log('Serviço removido dos destaques');
          }
        } catch (parseError) {
          console.error('Erro ao parsear featuredServiceIds:', parseError);
        }
      }

      // Excluir fotos do serviço primeiro (se existirem)
      const { error: photosError } = await supabase
        .from('service_photos')
        .delete()
        .eq('service_id', serviceId);

      if (photosError) {
        console.error('Erro ao excluir fotos do serviço:', photosError);
        // Não vamos parar aqui, vamos continuar com a exclusão do serviço
      }

      // Agora excluir o serviço
      const { error: serviceError } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (serviceError) {
        console.error('Erro ao excluir serviço:', serviceError);
        toast.error("Erro ao excluir serviço: " + serviceError.message);
        return;
      }

      console.log('Serviço excluído com sucesso do banco de dados');

      // Atualizar o estado local removendo o serviço
      const updatedServices = services.filter(service => service.id !== serviceId);
      setServices(updatedServices);
      
      console.log('Estado local atualizado, serviços restantes:', updatedServices.length);
      toast.success("Serviço excluído com sucesso!");
    } catch (error) {
      console.error('Erro inesperado ao excluir serviço:', error);
      toast.error("Erro inesperado ao excluir serviço");
    }
  };

  return {
    handleApprove,
    handleReject,
    handleUpdateService,
    handleDeleteService
  };
};

export default ServiceManager;
