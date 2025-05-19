
import { ServiceWithProvider } from "@/types";
import ServiceCard from "./ServiceCard";

interface ServiceListProps {
  services: ServiceWithProvider[];
  emptyMessage?: string;
}

const ServiceList = ({ 
  services, 
  emptyMessage = "Nenhum serviço encontrado." 
}: ServiceListProps) => {
  if (services.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};

export default ServiceList;
