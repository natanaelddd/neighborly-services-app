
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
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) {
        console.error('Erro ao excluir serviço:', error);
        toast.error("Erro ao excluir serviço");
        return;
      }

      // Remove o serviço deletado dos destaques (featuredServiceIds)
      const featuredServiceIdsStr = localStorage.getItem('featuredServiceIds');
      if (featuredServiceIdsStr) {
        let featuredServiceIds: number[] = [];
        try {
          featuredServiceIds = JSON.parse(featuredServiceIdsStr);
        } catch (_) {
          featuredServiceIds = [];
        }
        if (Array.isArray(featuredServiceIds)) {
          const updatedFeatured = featuredServiceIds.filter(id => id !== serviceId);
          localStorage.setItem('featuredServiceIds', JSON.stringify(updatedFeatured));
        }
      }

      setServices(services.filter(service => service.id !== serviceId));
      toast.success("Serviço excluído com sucesso!");
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      toast.error("Erro ao excluir serviço");
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
