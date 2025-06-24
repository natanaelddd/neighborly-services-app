
import ServiceList from './ServiceList';
import FeaturedServicesLoading from './FeaturedServicesLoading';
import FeaturedServicesHeader from './FeaturedServicesHeader';
import { useFeaturedServices } from '@/hooks/useFeaturedServices';

const FeaturedServices = () => {
  const { featuredServices, isLoading, error } = useFeaturedServices();

  if (isLoading) {
    return <FeaturedServicesLoading />;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <FeaturedServicesHeader error={error} />
        <ServiceList 
          services={featuredServices} 
          emptyMessage="Nenhum serviço cadastrado ainda. Cadastre o primeiro serviço para aparecer aqui!"
        />
      </div>
    </section>
  );
};

export default FeaturedServices;
