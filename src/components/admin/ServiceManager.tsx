
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: number;
  unit_id: string;
  category_id: number | null;
  title: string;
  description: string;
  whatsapp: string;
  status: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    block: string;
    house_number: string;
  };
  categories?: {
    name: string;
    icon: string;
  };
}

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
          ...updatedData,
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

  return {
    handleApprove,
    handleReject,
    handleUpdateService
  };
};

export default ServiceManager;
